package com.readwe.gimisangung.util;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.s3.AmazonS3;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.ImageDto;
import com.readwe.gimisangung.directory.exception.FileErrorCode;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;
import com.readwe.gimisangung.image.model.Image;
import com.readwe.gimisangung.image.model.repository.ImageRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class S3Service {
	private final AmazonS3 amazonS3;
	private final String bucket;
	private final ImageRepository imageRepository;

	public S3Service(AmazonS3 amazonS3, @Value("${aws.s3.bucket}") String bucket,
		ImageRepository imageRepository) {
		this.amazonS3 = amazonS3;
		this.bucket = bucket;
		this.imageRepository = imageRepository;
	}

	public void uploadImages(Contract contract, List<String> images) {
		for (String image : images) {
			uploadImage(contract, image);
		}
	}

	public void uploadImage(Contract contract, String image) {
		String type = image.substring(0, image.indexOf(","));
		if (!type.startsWith("data:image")) {
			throw new CustomException(GlobalErrorCode.ILLEGAL_ARGUMENT);
		}
		String fileName = UUID.randomUUID().toString();
		try {
			amazonS3.putObject(bucket, fileName, image);

			imageRepository.save(Image.builder()
				.contract(contract)
				.fileName(fileName)
				.build());
		} catch (Exception e) {
			throw new CustomException(FileErrorCode.SAVE_FILE_FAILED);
		}
	}

	public List<ImageDto> getImages(List<String> fileNames) {
		List<ImageDto> images = new ArrayList<>();
		int idx = 0;
		try {
			for (String fileName : fileNames) {
				images.add(ImageDto.builder()
					.page(++idx)
					.base64(amazonS3.getObjectAsString(bucket, fileName))
					.build());
			}
		} catch (Exception e) {
			throw new CustomException(FileErrorCode.GET_FILE_FAILED);
		}
		return images;
	}

	public void deleteFiles(List<String> fileNames) {
		for (String fileName : fileNames) {
			deleteFile(fileName);
		}
	}

	public void deleteFile(String fileName) {
		try {
			amazonS3.deleteObject(bucket, fileName);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
	}
}
