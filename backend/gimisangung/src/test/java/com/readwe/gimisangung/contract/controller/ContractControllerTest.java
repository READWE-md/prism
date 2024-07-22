package com.readwe.gimisangung.contract.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;
import com.readwe.gimisangung.contract.model.service.ContractService;

@ExtendWith(SpringExtension.class)
@WebMvcTest(
	controllers = ContractController.class,
	excludeAutoConfiguration = SecurityAutoConfiguration.class
)
class ContractControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	public ContractService contractService;

	// @Test
	// void createContract() throws Exception {
	// 	// given
	// 	Mockito.when(contractService.analyzeContract(Mockito.any(MultipartFile.class))).thenReturn(new AnalyzeResultDto());
	//
	// 	String name = "testImage";
	// 	String originalFileName = "testImage.jpeg";
	// 	String contentType = MediaType.IMAGE_JPEG_VALUE;
	// 	MockMultipartFile file = new MockMultipartFile(name, originalFileName, contentType, "test-image-content".getBytes());
	//
	// 	// when
	//
	// 	// then
	// 	mockMvc.perform(multipart("/api/v1/contracts").file(file)).andExpect(status().isCreated());
	// }
}