package com.readwe.gimisangung.directory.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.user.model.User;

@Repository
public interface DirectoryRepository extends JpaRepository<Directory, Long> {

	List<Directory> findAllByParentId(Long id);
	boolean existsByNameAndParentId(String name, Long parentId);
	int countByUser(User user);
	int countByUserId(Long userId);

}
