package com.readwe.gimisangung.s3;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.image.model.repository.ImageRepository;
import com.readwe.gimisangung.util.S3Service;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class S3ServiceTest {

	@Autowired
	S3Service s3Service;

	@MockBean
	ImageRepository imageRepository;

	private Contract contract;
	private String image;
	private String fileName;

	@BeforeEach
	void setContext() {
		contract = Contract
			.builder()
			.id(1L)
			.name("name")
			.build();
		image = "data:image, asdf";
		fileName = "a";
	}

	@Test
	void putObject() {
		Assertions.assertThat(s3Service.uploadImage(contract, image, fileName))
			.isTrue();
	}

	@Test
	void getImage() {
		Assertions.assertThat(s3Service.getImages(List.of(fileName)).getFirst().getBase64())
			.isEqualTo(image);
	}

	@Test
	void deleteImage() {
		Assertions.assertThat(s3Service.deleteFile(fileName))
			.isTrue();
	}

}
