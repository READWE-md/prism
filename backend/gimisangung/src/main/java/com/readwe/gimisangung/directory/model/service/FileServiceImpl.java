package com.readwe.gimisangung.directory.model.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.directory.model.repository.FileRepository;
import com.readwe.gimisangung.directory.model.entity.File;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

	private final FileRepository fileRepository;

	@Override
	public File getFile(Long id) {
		Optional<File> file = fileRepository.findById(id);

		return file.orElse(null);
	}
}
