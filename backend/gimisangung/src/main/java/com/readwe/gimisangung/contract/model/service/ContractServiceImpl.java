package com.readwe.gimisangung.contract.model.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.readwe.gimisangung.contract.exception.ContractErrorCode;
import com.readwe.gimisangung.contract.model.dto.ContractDetailResponseDto;
import com.readwe.gimisangung.contract.model.dto.ContractDto;
import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.dto.FindContractResponseDto;
import com.readwe.gimisangung.contract.model.dto.UpdateContractRequestDto;
import com.readwe.gimisangung.contract.model.entity.Clause;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.ContractAnalysisResult;
import com.readwe.gimisangung.contract.model.entity.ContractStatus;
import com.readwe.gimisangung.contract.model.entity.ImageDto;
import com.readwe.gimisangung.contract.model.repository.ContractAnalysisResultRepository;
import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.contract.model.repository.TagRepository;
import com.readwe.gimisangung.directory.exception.DirectoryErrorCode;
import com.readwe.gimisangung.directory.exception.FileErrorCode;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.image.model.Image;
import com.readwe.gimisangung.image.model.repository.ImageRepository;
import com.readwe.gimisangung.image.model.service.ImageService;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.util.FastAPIClient;
import com.readwe.gimisangung.util.FileNameValidator;
import com.readwe.gimisangung.util.S3Service;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

	private final S3Service s3Service;
	private final TagService tagService;
	private final TagRepository tagRepository;
	private final ImageService imageService;
	private final ImageRepository imageRepository;
	private final ContractRepository contractRepository;
	private final DirectoryRepository directoryRepository;
	private final ContractAnalysisResultRepository contractAnalysisResultRepository;
	private static final Logger log = LoggerFactory.getLogger(ContractServiceImpl.class);

	@Override
	@Transactional(readOnly = true)
	public FindContractResponseDto findContract(User user, String keyword) {
		if (keyword.isBlank() || !FileNameValidator.isValidFileName(keyword)) {
			throw new CustomException(ContractErrorCode.INVALID_KEYWORD);
		}

		return FindContractResponseDto.builder()
			.searchResult(contractRepository.findAllByUserIdAndKeyword(user.getId(), keyword))
			.build();
	}

	@Override
	@Transactional(readOnly = true)
	public ContractDetailResponseDto getContractDetail(User user, Long id) {

		Contract contract = contractRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_FOUND));

		if (!contract.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		List<String> fileNames = imageRepository.findAllByContractIdOrderById(id)
			.stream().map(Image::getFileName).toList();
		List<ImageDto> imageDtos = s3Service.getImages(fileNames);

		ContractAnalysisResult contractAnalysisResult = contractAnalysisResultRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_ANALYZED));
		List<Clause> clauses = contractAnalysisResult.getClauses();
		contract.setStatus(ContractStatus.DONE);

		return ContractDetailResponseDto.builder()
			.contractId(contract.getId())
			.imageDtos(imageDtos)
			.clauses(clauses)
			.build();
	}

	@Override
	@Transactional(readOnly = true)
	public List<ContractDto> getContractsByParentId(Long id, User user) {
		if (!directoryRepository.findById(id)
			.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND))
			.getUser().getId().equals(user.getId())
		) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		return contractRepository.findAllByParentIdToContractDto(id);
	}

	@Override
	public Contract createContract(User user, CreateContractRequestDto createContractRequestDto) {

		if (!FileNameValidator.isValidFileName(createContractRequestDto.getName())) {
			throw new CustomException(FileErrorCode.INVALID_FILE_NAME);
		}

		Directory parent = directoryRepository.findById(createContractRequestDto.getParentId())
			.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!parent.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		if (contractRepository.existsByParentIdAndName(parent.getId(), createContractRequestDto.getName())) {
			throw new CustomException(ContractErrorCode.CONTRACT_EXISTS);
		}

		Contract contract = Contract.builder()
			.name(createContractRequestDto.getName())
			.user(user)
			.parent(parent)
			.status(ContractStatus.UPLOAD)
			.build();

		Contract savedContract = contractRepository.save(contract);
		tagService.saveTags(savedContract, createContractRequestDto.getTags());
		s3Service.uploadImages(savedContract, createContractRequestDto.getImages());

		try {
			ResponseEntity<?> response = FastAPIClient.sendRequest(savedContract.getId(),
				createContractRequestDto.getImages());
			if (!response.getStatusCode().is2xxSuccessful()) {
				savedContract.setStatus(ContractStatus.FAIL);
			}
		} catch (Exception e) {
			savedContract.setStatus(ContractStatus.FAIL);
		}

		return savedContract;
	}

	@Override
	public void updateContract(User user, Long id, UpdateContractRequestDto dto) {
		Contract contract = contractRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_FOUND));

		if (!contract.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		if (dto.getParentId() != null && !contract.getParent().getId().equals(dto.getParentId())) {
			Directory parent = directoryRepository.findById(dto.getParentId())
				.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));
			if (!parent.getUser().getId().equals(user.getId())) {
				throw new CustomException(UserErrorCode.FORBIDDEN);
			}
			if (contractRepository.existsByParentIdAndName(parent.getId(), contract.getName())) {
				throw new CustomException(ContractErrorCode.CONTRACT_EXISTS);
			}
			contract.setParent(parent);
		}

		if (dto.getName() != null && !contract.getName().equals(dto.getName())) {
			Directory parent = directoryRepository.findById(contract.getParent().getId())
				.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));
			if (!FileNameValidator.isValidFileName(dto.getName())) {
				throw new CustomException(FileErrorCode.INVALID_FILE_NAME);
			}
			if (contractRepository.existsByParentIdAndName(parent.getId(), dto.getName())) {
				throw new CustomException(ContractErrorCode.CONTRACT_EXISTS);
			}
			contract.setName(dto.getName());
		}

		if (dto.getTags() != null) {
			for (String tag : dto.getTags()) {
				log.info(tag);
				if (!FileNameValidator.isValidFileName(tag)) {
					throw new CustomException(ContractErrorCode.INVALID_KEYWORD);
				}
			}

			tagService.saveTags(contract, dto.getTags());
		}
	}

	@Override
	public void deleteContract(User user, Long id) {
		Contract contract = contractRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_FOUND));

		if (!contract.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		tagRepository.deleteAllByContractId(id);
		contractAnalysisResultRepository.deleteById(id);
		imageService.deleteImagesByContractId(id);
		contractRepository.deleteById(id);
	}

	@Override
	public void deleteContracts(List<Contract> contracts) {
		for (Contract contract : contracts) {
			Long id = contract.getId();
			tagRepository.deleteAllByContractId(id);
			contractAnalysisResultRepository.deleteById(id);
			imageService.deleteImagesByContractId(id);
			contractRepository.deleteById(id);
		}
	}

}