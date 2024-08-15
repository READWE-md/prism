package com.readwe.gimisangung.contract.model.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
import com.readwe.gimisangung.exception.GlobalErrorCode;
import com.readwe.gimisangung.image.model.Image;
import com.readwe.gimisangung.image.model.repository.ImageRepository;
import com.readwe.gimisangung.image.model.service.ImageService;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.util.FastAPIClient;
import com.readwe.gimisangung.util.FileNameValidator;
import com.readwe.gimisangung.util.RedisRepository;
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
	private final RedisRepository redisRepository;
	private final ContractRepository contractRepository;
	private final DirectoryRepository directoryRepository;
	private final ContractAnalysisResultRepository contractAnalysisResultRepository;

	@Override
	public FindContractResponseDto findContracts(User user, String keyword, LocalDateTime startDate, LocalDateTime endDate) {
		if (keyword != null && !FileNameValidator.isValidFileName(keyword)) {
			throw new CustomException(ContractErrorCode.INVALID_KEYWORD);
		}

		Map<String, Object> params = new HashMap<>();
		params.put("keyword", keyword);
		params.put("startDate", startDate);
		if (endDate != null) {
			params.put("endDate", endDate.plusDays(1).minusSeconds(1));
		}

		return FindContractResponseDto.builder()
			.contracts(contractRepository.findByUserIdAndParams(user.getId(), params))
			.build();
	}

	@Override
	@Cacheable(cacheNames = "contractDetail", key = "#id")
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

		return ContractDetailResponseDto.builder()
			.contractId(contract.getId())
			.images(imageDtos)
			.clauses(clauses)
			.build();
	}

	@Override
	public List<ContractDto> getContractsByParentId(Long id, User user) {
		if (!directoryRepository.findById(id)
			.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND))
			.getUser().getId().equals(user.getId())
		) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		return contractRepository.findAllByParentId(id);
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

		if (!redisRepository.setDataIfAbsent(user.getId() + createContractRequestDto.getParentId()
			+ ":createContract", "1", 10L)) {
			throw new CustomException(GlobalErrorCode.DUPLICATE_REQUEST);
		}

		Contract contract = Contract.builder()
			.name(createContractRequestDto.getName())
			.user(user)
			.status(ContractStatus.ANALYZE_INIT)
			.viewedAt(LocalDateTime.now())
			.parent(parent)
			.build();

		Contract savedContract = contractRepository.save(contract);
		tagService.saveInitialTags(user, savedContract);
		s3Service.uploadImages(savedContract, createContractRequestDto.getImages());
		List<String> images = createContractRequestDto.getImages().stream()
			.map(o -> o.substring(o.indexOf(",") + 1)).toList();

		try {
			ResponseEntity<?> response = FastAPIClient.sendRequest(savedContract.getId(),
				images);
			if (!response.getStatusCode().is2xxSuccessful()) {
				savedContract.setStatus(ContractStatus.FAIL);
			}
		} catch (Exception e) {
			savedContract.setStatus(ContractStatus.FAIL);
		}

		return savedContract;
	}

	@Override
	public void updateContract(User user, Long id, UpdateContractRequestDto updateContractRequestDto) {
		Contract contract = contractRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_FOUND));

		if (!contract.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		if (updateContractRequestDto.getParentId() != null && !contract.getParent().getId().equals(updateContractRequestDto.getParentId())) {
			Directory parent = directoryRepository.findById(updateContractRequestDto.getParentId())
				.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));
			if (!parent.getUser().getId().equals(user.getId())) {
				throw new CustomException(UserErrorCode.FORBIDDEN);
			}
			if (contractRepository.existsByParentIdAndName(parent.getId(), contract.getName())) {
				throw new CustomException(ContractErrorCode.CONTRACT_EXISTS);
			}
			contract.setParent(parent);
		}

		if (updateContractRequestDto.getName() != null && !contract.getName().equals(updateContractRequestDto.getName())) {
			Directory parent = directoryRepository.findById(contract.getParent().getId())
				.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));
			if (!FileNameValidator.isValidFileName(updateContractRequestDto.getName())) {
				throw new CustomException(FileErrorCode.INVALID_FILE_NAME);
			}
			if (contractRepository.existsByParentIdAndName(parent.getId(), updateContractRequestDto.getName())) {
				throw new CustomException(ContractErrorCode.CONTRACT_EXISTS);
			}
			contract.setName(updateContractRequestDto.getName());
		}

		if (updateContractRequestDto.getTags() != null) {
			for (String tag : updateContractRequestDto.getTags()) {
				if (!FileNameValidator.isValidFileName(tag)) {
					throw new CustomException(ContractErrorCode.INVALID_TAG_NAME);
				}
			}

			tagService.saveTags(user, contract, updateContractRequestDto.getTags());
		}

		if (updateContractRequestDto.getStartDate() != null && updateContractRequestDto.getExpireDate() != null) {
			if (updateContractRequestDto.getStartDate().isBefore(updateContractRequestDto.getExpireDate())) {
				throw new CustomException(ContractErrorCode.INVALID_DATE);
			}
			contract.setStartDate(updateContractRequestDto.getStartDate());
			contract.setExpireDate(updateContractRequestDto.getExpireDate());
		} else if (updateContractRequestDto.getStartDate() != null) {
			if (contract.getExpireDate().isBefore(updateContractRequestDto.getStartDate())) {
				throw new CustomException(ContractErrorCode.INVALID_DATE);
			}
			contract.setStartDate(updateContractRequestDto.getStartDate());
		} else if (updateContractRequestDto.getExpireDate() != null) {
			if (contract.getStartDate().isAfter(updateContractRequestDto.getExpireDate())) {
				throw new CustomException(ContractErrorCode.INVALID_DATE);
			}
			contract.setExpireDate(updateContractRequestDto.getExpireDate());
		}
	}

	@Override
	public void deleteContract(User user, Long id) {
		Contract contract = contractRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_FOUND));

		if (!contract.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		deleteContract(id);
	}

	@CacheEvict(cacheNames = "contractDetail", key = "#id")
	public void deleteContract(Long id) {
		tagRepository.deleteAllByContractId(id);
		contractAnalysisResultRepository.deleteById(id);
		imageService.deleteImagesByContractId(id);
		contractRepository.deleteById(id);
	}

	@Override
	public void deleteContracts(List<Contract> contracts) {
		for (Contract contract : contracts) {
			deleteContract(contract.getId());
		}
	}

	@Override
	public void updateViewedAt(Long id) {
		Contract contract = contractRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_FOUND));

		contract.setViewedAt(LocalDateTime.now());
		tagService.updateViewedAt(contract.getTags());
	}

}