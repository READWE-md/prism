package com.readwe.gimisangung.image.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.readwe.gimisangung.image.model.Image;
import com.readwe.gimisangung.image.model.repository.ImageRepository;
import com.readwe.gimisangung.util.S3Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

	private final S3Service s3Service;
	private final ImageRepository imageRepository;

	@Override
	@Transactional
	public void deleteImagesByContractId(Long id) {
		List<String> fileNames = imageRepository.findAllByContractIdOrderById(id).stream()
			.map(Image::getFileName).toList();

		s3Service.deleteFiles(fileNames);
		imageRepository.deleteAllByContractId(id);
	}

}
