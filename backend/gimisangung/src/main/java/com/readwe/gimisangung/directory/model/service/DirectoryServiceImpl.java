package com.readwe.gimisangung.directory.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.directory.exception.DirectoryErrorCode;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.vo.CreateDirectoryVo;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DirectoryServiceImpl implements DirectoryService {

	private final DirectoryRepository directoryRepository;
	private final ContractRepository contractRepository;

	/**
	 * 사용자의 새로운 디렉토리를 생성하는 메서드
	 * @param createDirectoryVo 새로운 디렉토리에 대한 정보를 담고있는 객체
	 * @param user 디렉토리 소유자
	 * @return 생성된 디렉토리
	 */
	@Override
	@Transactional
	public Directory createDirectory(CreateDirectoryVo createDirectoryVo, User user) {

		Directory parentDir = directoryRepository.findById(createDirectoryVo.getParentId()).orElseThrow(
			() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!parentDir.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		if (directoryRepository.existsByNameAndParentId(createDirectoryVo.getName(), createDirectoryVo.getParentId())) {
			throw new CustomException(DirectoryErrorCode.DIRECTORY_EXISTS);
		}

		Directory directory = new Directory(null, createDirectoryVo.getName(), null, user, parentDir);
		return directoryRepository.save(directory);
	}

	/**
	 * 사용자의 루트 디렉토리를 생성하는 메서드
	 * @param user 루트 디렉토리 소유자
	 * @return 생성된 루트 디렉토리
	 */
	@Override
	public Directory createRootDirectory(User user) {

		Directory directory = new Directory(null, user.getEmail(), null, user, null);

		return directoryRepository.save(directory);
	}

	/**
	 * 디렉토리의 서브 디렉토리를 모두 조회하는 메서드
	 * @param id 디렉토리 아이디
	 * @param user 소유자
	 * @return 서브 디렉토리 리스트
	 */
	@Override
	@Transactional
	public List<Directory> getDirectoriesByParentId(
		Long id, User user) {

		Directory directory = directoryRepository.findById(id).orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!directory.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		return directoryRepository.findAllByParentId(id);
	}

	@Override
	public void renameDirectory(Long id, String newName, User user) {

		if (user == null) {
			// TODO: 요청 사용자가 없어 발생하는 예외(401)로 변경
			throw new RuntimeException();
		}

		// TODO: 수정하려는 디렉토리가 존재하지 않아 발생하는 예외(404)로 변경
		Directory directory = directoryRepository.findById(id).orElseThrow(RuntimeException::new);

		if (!directory.getUser().getId().equals(user.getId())) {
			// todo: 수정하려는 디렉토리에 대한 권한을 갖고있지 않아 발생하는 예외(403)
			throw new RuntimeException();
		}

		if (directoryRepository.existsByNameAndParentId(newName, directory.getParent().getId())) {
			// todo: 같은 경로에 같은 이름의 디렉토리가 존재해 발생하는 예외(409)로 변경
			throw new RuntimeException();
		}

		directory.update(newName, null);

		directoryRepository.save(directory);
	}

	@Override
	public void moveDirectory(Long id, Long newParentId, User user) {

		if (user == null) {
			// TODO: 요청 사용자가 없어 발생하는 예외(401)로 변경
			throw new RuntimeException();
		}

		// TODO: 수정하려는 디렉토리가 존재하지 않아 발생하는 예외(404)로 변경
		Directory directory = directoryRepository.findById(id).orElseThrow(RuntimeException::new);

		if (!directory.getUser().getId().equals(user.getId())) {
			// todo: 수정하려는 디렉토리에 대한 권한을 갖고있지 않아 발생하는 예외(403)
			throw new RuntimeException();
		}

		// todo: 새로운 경로의 디렉토리가 존재하지 않아 발생하는 예외(404)
		Directory newParentDirectory = directoryRepository.findById(newParentId).orElseThrow(RuntimeException::new);

		if (!newParentDirectory.getUser().getId().equals(user.getId())) {
			// todo: 새로운 부모 디렉토리에 대한 권한을 갖고있지 않아 발생하는 예외
			throw new RuntimeException();
		}

		if (directoryRepository.existsByNameAndParentId(directory.getName(), newParentId)) {
			// todo: 새로운 경로에 같은 이름의 디렉토리가 존재해 발생하는 예외(409)로 변경
			throw new RuntimeException();
		}

		directory.update(null, newParentDirectory);

		directoryRepository.save(directory);
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

		contractRepository.deleteAllByParentId(directory.getId());

		for (Directory subDirectory : subDirectories) {
			deleteDirectory(subDirectory);
		}

		directoryRepository.delete(directory);
	}
}
