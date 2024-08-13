package com.readwe.gimisangung.directory.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.contract.model.service.ContractService;
import com.readwe.gimisangung.directory.exception.DirectoryErrorCode;
import com.readwe.gimisangung.directory.model.dto.DirectoryDto;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.dto.CreateDirectoryRequestDto;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.util.RedisRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DirectoryServiceImpl implements DirectoryService {

	private final DirectoryRepository directoryRepository;
	private final ContractRepository contractRepository;
	private final ContractService contractService;
	private final RedisRepository redisRepository;

	/**
	 * 사용자의 새로운 디렉토리를 생성하는 메서드
	 * @param createDirectoryRequestDto 새로운 디렉토리에 대한 정보를 담고있는 객체
	 * @param user 디렉토리 소유자
	 * @return 생성된 디렉토리
	 */
	@Override
	public Directory createDirectory(CreateDirectoryRequestDto createDirectoryRequestDto, User user) {

		Directory parentDir = directoryRepository.findById(createDirectoryRequestDto.getParentId()).orElseThrow(
			() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!parentDir.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		if (directoryRepository.existsByNameAndParentId(createDirectoryRequestDto.getName(), createDirectoryRequestDto.getParentId())) {
			throw new CustomException(DirectoryErrorCode.DIRECTORY_EXISTS);
		}

		if (!redisRepository.setDataIfAbsent(user.getId() + createDirectoryRequestDto.getParentId()
			+ ":createDirectory", "1", 10L)) {
			throw new CustomException(GlobalErrorCode.DUPLICATE_REQUEST);
		}

		Directory directory = Directory.builder()
			.name(createDirectoryRequestDto.getName())
			.user(user)
			.parent(parentDir)
			.build();

		return directoryRepository.save(directory);
	}

	/**
	 * 사용자의 루트 디렉토리를 생성하는 메서드
	 * @param user 루트 디렉토리 소유자
	 * @return 생성된 루트 디렉토리
	 */
	@Override
	public Directory createRootDirectory(User user) {

		Directory directory = Directory.builder()
			.name(user.getId().toString())
			.user(user)
			.build();

		Directory savedDirectory = directoryRepository.save(directory);

		return savedDirectory;
	}

	@Override
	@Transactional(readOnly = true)
	public Directory getDirectory(Long id, User user) {

		Directory directory = directoryRepository.findById(id).orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!directory.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		return directory;
	}

	/**
	 * 디렉토리의 서브 디렉토리를 모두 조회하는 메서드
	 * @param id 디렉토리 아이디
	 * @param user 소유자
	 * @return 서브 디렉토리 리스트
	 */
	@Override
	@Transactional(readOnly = true)
	public List<DirectoryDto> getDirectoriesByParentId(
		Long id, User user) {

		Directory directory = directoryRepository.findById(id).orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!directory.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		return directoryRepository.findAllByParentId(id).stream()
			.map(DirectoryDto::of).toList();
	}

	/**
	 * 디렉토리의 이름을 수정하는 메서드
	 * @param id 수정하려는 디렉토리 아이디
	 * @param newName 새로운 이름
	 * @param user 수정 요청자
	 */
	@Override
	public void renameDirectory(Long id, String newName, User user) {

		Directory directory = directoryRepository.findById(id).orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!directory.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		if (directoryRepository.existsByNameAndParentId(newName, directory.getParent().getId())) {
			throw new CustomException(DirectoryErrorCode.DIRECTORY_EXISTS);
		}

		directory.setName(newName);
	}

	/**
	 * 디렉토리 경로를 이동시키는 메서드
	 * @param id 이동시키려는 디렉토리
	 * @param newParentId 새로운 위치의 부모 디렉토리
	 * @param user 요청자
	 */
	@Override
	public void moveDirectory(Long id, Long newParentId, User user) {

		Directory directory = directoryRepository.findById(id).orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!directory.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		Directory newParentDirectory = directoryRepository.findById(newParentId).orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!newParentDirectory.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		if (directoryRepository.existsByNameAndParentId(directory.getName(), newParentId)) {
			throw new CustomException(DirectoryErrorCode.DIRECTORY_EXISTS);
		}

		directory.setParent(newParentDirectory);
	}

	@Override
	@Transactional
	public void deleteDirectory(Long id, User user) {

		Directory directory = directoryRepository.findById(id).orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!directory.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		deleteDirectory(directory);
	}

	private void deleteDirectory(Directory directory) {
		List<Directory> subDirectories = directoryRepository.findAllByParentId(directory.getId());

		for (Directory subDirectory : subDirectories) {
			deleteDirectory(subDirectory);
		}

		List<Contract> contracts = contractRepository.findAllByParentIdOrderById(directory.getId());
		contractService.deleteContracts(contracts);

		directoryRepository.delete(directory);
	}
}
