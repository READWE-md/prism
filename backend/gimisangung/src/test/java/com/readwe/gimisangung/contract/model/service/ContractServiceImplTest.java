package com.readwe.gimisangung.contract.model.service;

import static org.junit.jupiter.api.Assertions.*;

import java.io.InputStream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class ContractServiceImplTest {

	@Autowired
	private ContractService contractService;

	@Test
	void analyzeContract() throws Exception {

		// given
		String name = "testImage";
		String originalFileName = "testImage.jpeg";
		String contentType = MediaType.IMAGE_JPEG_VALUE;
		InputStream imageInputStream = getClass().getResourceAsStream("/static/images/testImage.jpeg");

		MockMultipartFile file = new MockMultipartFile(name, originalFileName, contentType, imageInputStream);

		// when

		// then
		assertThrows(Exception.class, () -> contractService.analyzeContract(file));
	}
}