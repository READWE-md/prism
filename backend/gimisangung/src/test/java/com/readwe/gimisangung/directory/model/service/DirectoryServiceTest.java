package com.readwe.gimisangung.directory.model.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.directory.model.vo.CreateDirectoryVo;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.repository.UserRepository;

import jakarta.transaction.Transactional;

@SpringBootTest
@Rollback
@Transactional
class DirectoryServiceTest {

	@Autowired
	private DirectoryServiceImpl directoryService;

	@Autowired
	private DirectoryRepository directoryRepository;

	@Autowired
	private UserRepository userRepository;

	private User savedUser;

	@BeforeEach
	void before() {
		User user = new User(null, "test", "email", "password", "salt", 0L);
		savedUser = userRepository.save(user);
	}

	@Test
	@DisplayName("서브 디렉토리 생성")
	void testCreateDirectory() {
		// Given
		Directory root = directoryService.createRootDirectory(savedUser);
		CreateDirectoryVo createDirectoryVo = new CreateDirectoryVo(root.getId(), "sub");

		// When
		Directory created = directoryService.createDirectory(createDirectoryVo, savedUser);

		// Then
		assertNotNull(directoryRepository.findById(created.getId()));
	}

	@Test
	@DisplayName("루트 디렉토리 생성")
	void testCreateRootDirectory() {
		// Given
		Directory root = Directory.builder()
			.name(savedUser.getEmail())
			.user(savedUser)
			.build();

		// When
		Directory result = directoryService.createRootDirectory(savedUser);
		Optional<Directory> directory = directoryRepository.findById(result.getId());

		// Then
		assertNotNull(directory.orElse(null));
	}

	@Test
	@DisplayName("디렉토리 삭제")
	void testDeleteDirectory() {
		// Given
		Directory root = Directory.builder()
			.name(savedUser.getEmail())
			.user(savedUser)
			.build();

		Directory rootDirectory = directoryService.createRootDirectory(savedUser);
		CreateDirectoryVo createDirectoryVo1 = new CreateDirectoryVo(rootDirectory.getId(), "sub1");
		Directory subDirectory = directoryService.createDirectory(createDirectoryVo1, savedUser);
		CreateDirectoryVo createDirectoryVo2 = new CreateDirectoryVo(subDirectory.getId(), "sub2");

		// When

		directoryService.deleteDirectory(rootDirectory.getId(), savedUser);
		int directoryCnt = directoryRepository.countByUserId(savedUser.getId());

		// Then
		assertEquals(0, directoryCnt);
	}

	@Test
	@DisplayName("서브 디렉토리 조회")
	void testGetDirectoriesByParentId() {
		// Given
		Directory root = directoryService.createRootDirectory(savedUser);
		CreateDirectoryVo createDirectoryVo1 = new CreateDirectoryVo(root.getId(), "sub1");
		CreateDirectoryVo createDirectoryVo2 = new CreateDirectoryVo(root.getId(), "sub2");

		// When
		Directory created1 = directoryService.createDirectory(createDirectoryVo1, savedUser);
		Directory created2 = directoryService.createDirectory(createDirectoryVo2, savedUser);

		// Then
		assertEquals(2, directoryRepository.findAllByParentId(root.getId()).size());
	}

	@Test
	@DisplayName("디렉토리 이름 변경")
	void testRenameDirectory() {
		// Given
		Directory root = directoryService.createRootDirectory(savedUser);
		CreateDirectoryVo createDirectoryVo1 = new CreateDirectoryVo(root.getId(), "sub1");
		Directory created1 = directoryService.createDirectory(createDirectoryVo1, savedUser);

		String newName = "new name";

		// When
		directoryService.renameDirectory(created1.getId(), newName, savedUser);
		Directory target = directoryRepository.findById(created1.getId()).orElse(null);

		// Then
		assertNotNull(target);
		assertEquals(newName, target.getName());
	}
	
	@Test
	@DisplayName("디렉토리 이동")
	void testMoveDirectory() {
		// Given
		Directory root = directoryService.createRootDirectory(savedUser);
		CreateDirectoryVo createDirectoryVo1 = new CreateDirectoryVo(root.getId(), "sub1");
		CreateDirectoryVo createDirectoryVo2 = new CreateDirectoryVo(root.getId(), "sub2");
		Directory created1 = directoryService.createDirectory(createDirectoryVo1, savedUser);
		Directory created2 = directoryService.createDirectory(createDirectoryVo2, savedUser);

		// When
		directoryService.moveDirectory(created2.getId(), created1.getId(), savedUser);
		Directory target = directoryRepository.findById(created2.getId()).orElse(null);

		// Then
		assertNotNull(target);
		assertEquals(created1.getId(), target.getParent().getId());
	}
}