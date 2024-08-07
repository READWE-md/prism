package com.readwe.gimisangung.directory.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.directory.model.dto.DirectoryDto;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.dto.CreateDirectoryRequestDto;
import com.readwe.gimisangung.user.model.User;

@Service
public interface DirectoryService {

	Directory createDirectory(CreateDirectoryRequestDto createDirectoryRequestDto, User user);
	Directory createRootDirectory(User user);

	Directory getDirectory(Long id, User user);
	List<DirectoryDto> getDirectoriesByParentId(Long id, User user);

	void renameDirectory(Long id, String newName, User user);
	void moveDirectory(Long id, Long newParentId, User user);

	void deleteDirectory(Long id, User user);
}
