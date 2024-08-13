package com.readwe.gimisangung.util;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.ImageDto;
import com.readwe.gimisangung.directory.exception.FileErrorCode;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;
import com.readwe.gimisangung.image.model.Image;
import com.readwe.gimisangung.image.model.repository.ImageRepository;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Slf4j
@Service
@Transactional
public class S3Service {
	private final S3Client amazonS3;
	private final String bucket;
	private final ImageRepository imageRepository;

	public S3Service(S3Client amazonS3, @Value("${aws.s3.bucket}") String bucket,
		ImageRepository imageRepository) {
		this.amazonS3 = amazonS3;
		this.bucket = bucket;
		this.imageRepository = imageRepository;
	}

	public void uploadImages(Contract contract, List<String> images) {
		for (String image : images) {
			String fileName = UUID.randomUUID().toString();
			uploadImage(contract, image, fileName);
		}
	}

	public boolean uploadImage(Contract contract, String image, String fileName) {
		String type = image.substring(0, image.indexOf(","));
		if (!type.startsWith("data:image")) {
			throw new CustomException(GlobalErrorCode.ILLEGAL_ARGUMENT);
		}

		try {
			PutObjectRequest putObjectRequest = PutObjectRequest.builder()
				.bucket(bucket)
				.key(fileName)
				.build();
			amazonS3.putObject(
				putObjectRequest, RequestBody.fromString(image));

			imageRepository.save(Image.builder()
				.contract(contract)
				.fileName(fileName)
				.build());
		} catch (Exception e) {
			throw new CustomException(FileErrorCode.SAVE_FILE_FAILED);
		}
		return true;
	}

	public List<ImageDto> getImages(List<String> fileNames) {
		List<ImageDto> images = new ArrayList<>();
		int idx = 0;
		try {
			for (String fileName : fileNames) {
				GetObjectRequest getObjectRequest = GetObjectRequest.builder()
					.bucket(bucket)
					.key(fileName)
					.build();

				String base64 = new String(amazonS3.getObject(getObjectRequest).readAllBytes());

				images.add(ImageDto.builder()
					.page(++idx)
					.base64(base64)
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

	public boolean deleteFile(String fileName) {
		try {
			DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
				.bucket(bucket)
				.key(fileName)
				.build();
			amazonS3.deleteObject(deleteObjectRequest);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		return true;
	}
}
