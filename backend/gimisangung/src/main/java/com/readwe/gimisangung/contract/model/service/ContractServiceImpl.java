package com.readwe.gimisangung.contract.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.readwe.gimisangung.contract.exception.ContractErrorCode;
import com.readwe.gimisangung.contract.model.dto.ContractDetailResponseDto;
import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.dto.FindContractResultDto;
import com.readwe.gimisangung.contract.model.dto.UpdateContractRequestDto;
import com.readwe.gimisangung.contract.model.entity.Clause;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.ContractAnalysisResult;
import com.readwe.gimisangung.contract.model.entity.ContractStatus;
import com.readwe.gimisangung.contract.model.entity.Image;
import com.readwe.gimisangung.contract.model.entity.Tag;
import com.readwe.gimisangung.contract.model.repository.ContractAnalysisResultRepository;
import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.contract.model.repository.TagRepository;
import com.readwe.gimisangung.directory.exception.DirectoryErrorCode;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.util.FileNameValidator;
import com.readwe.gimisangung.util.FileUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

	private final ContractRepository contractRepository;
	private final DirectoryRepository directoryRepository;
	private final TagService tagService;
	private final ContractAnalysisResultRepository contractAnalysisResultRepository;
	private final TagRepository tagRepository;

	@Override
	public List<FindContractResultDto> findContract(User user, List<String> tags, String name) {
		List<Contract> contracts = new ArrayList<>();

		if (tags.isEmpty() && name.isBlank()) {
			contracts = contractRepository.findAllByUserId(user.getId());
		} else if (!tags.isEmpty()) {

			if (tags.stream().allMatch(FileNameValidator::isValidFileName)) {
				contracts = contractRepository.findAllByUserId(user.getId());
				for (int i = contracts.size() - 1; i >= 0; i--) {
					Set<String> tagNames = tagRepository.findAllByContractId(contracts.get(i).getId())
						.stream().map(Tag::getName).collect(Collectors.toSet());
					if (!tagNames.containsAll(tags))
						contracts.remove(i);
				}
			}
		} else if (!name.isBlank() && FileNameValidator.isValidFileName(name)) {
			contracts = contractRepository.findAllByUserIdAndName(user.getId(), name);
		}

		List<FindContractResultDto> list = new ArrayList<>();
		for (Contract contract : contracts) {
			List<String> tagList = tagRepository.findAllByContractId(contract.getId())
				.stream().map(Tag::getName).toList();

			list.add(FindContractResultDto.builder()
				.id(contract.getId())
				.name(contract.getName())
				.created_at(contract.getCreatedAt())
				.tags(tagList)
				.status(contract.getStatus())
				.parentId(contract.getParent().getId())
				.build());
		}
		return list;
	}

	@Override
	@Transactional
	public ContractDetailResponseDto getContractDetail(User user, Long id) {

		Contract contract = contractRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_FOUND));

		if (!contract.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		List<File> files = FileUtil.getFiles(contract.getFilePath());
		List<Image> images = FileUtil.convertToImage(files);

		ContractAnalysisResult contractAnalysisResult = contractAnalysisResultRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_ANALYZED));
		List<Clause> clauses = contractAnalysisResult.getClauses();
		contract.setStatus(ContractStatus.DONE);

		return ContractDetailResponseDto.builder()
			.contractId(contract.getId())
			.images(images)
			.clauses(clauses)
			.build();
	}

	@Override
	public List<Contract> getContractsByParentId(Long id, User user) {
		if (!directoryRepository.findById(id)
			.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND))
			.getUser().getId().equals(user.getId())
		) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		return contractRepository.findAllByParentId(id);
	}

	@Override
	@Transactional
	public Contract createContract(User user, CreateContractRequestDto createContractRequestDto) {

		if (!FileNameValidator.isValidFileName(createContractRequestDto.getName())) {
			throw new CustomException(GlobalErrorCode.BAD_REQUEST);
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

		File userDirectory = FileUtil.createFolder(user.getId(), savedContract.getId());
		FileUtil.saveImages(userDirectory.getPath(), createContractRequestDto.getImages());
		savedContract.setFilePath(userDirectory.getPath());

		return savedContract;
	}

	@Override
	@Transactional
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
			Directory parent = (Directory) contract.getParent();
			if (FileNameValidator.isValidFileName(dto.getName())) {
				throw new CustomException(GlobalErrorCode.BAD_REQUEST);
			}
			if (contractRepository.existsByParentIdAndName(parent.getId(), dto.getName())) {
				throw new CustomException(ContractErrorCode.CONTRACT_EXISTS);
			}
			contract.setName(dto.getName());
		}

		if (dto.getTags() != null) {
			if (!dto.getTags().stream().allMatch(FileNameValidator::isValidFileName)) {
				throw new CustomException(GlobalErrorCode.BAD_REQUEST);
			}

			Set<String> tags = tagRepository.findAllByContractId(contract.getId())
				.stream().map(Tag::getName).collect(Collectors.toSet());
			if (!tags.equals(new HashSet<>(dto.getTags()))) {
				tagRepository.deleteAllByContractId(contract.getId());
				tagService.saveTags(contract, dto.getTags());
			}
		}
	}

	@Override
	@Transactional
	public void deleteContract(User user, Long id) {
		Contract contract = contractRepository.findById(id)
			.orElseThrow(() -> new CustomException(ContractErrorCode.CONTRACT_NOT_FOUND));

		if (!contract.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		tagRepository.deleteAllByContractId(id);
		contractAnalysisResultRepository.deleteById(id);
		FileUtil.deleteDirectory(contract.getFilePath());
		contractRepository.deleteById(id);
	}

}