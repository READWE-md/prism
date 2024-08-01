package com.readwe.gimisangung.directory.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.directory.model.entity.File;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

}
