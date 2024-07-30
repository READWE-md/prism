package com.readwe.gimisangung.directory.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.contract.exception.DuplicateFileNameAndTypeException;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.vo.CreateDirectoryVo;
import com.readwe.gimisangung.user.model.User;

@Service
public interface DirectoryService {

	Directory createDirectory(CreateDirectoryVo createDirectoryVo, User user);

	Directory createRootDirectory(User user);

	void deleteDirectory(Long id, User user);

	List<Directory> getDirectoriesByParentId(Long id, User user);

	void renameDirectory(Long id, String newName, User user);

	void moveDirectory(Long id, Long newParentId, User user);
}
