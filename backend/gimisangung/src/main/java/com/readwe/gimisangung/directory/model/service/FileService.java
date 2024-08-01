package com.readwe.gimisangung.directory.model.service;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.directory.model.entity.File;

public interface FileService {

	File getFile(Long id);
}
