package com.readwe.gimisangung.contract.model.service;

import static org.junit.jupiter.api.Assertions.*;

import java.io.InputStream;
import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.readwe.gimisangung.util.OpenAIClientWrapper;

@SpringBootTest
@ContextConfiguration(classes = {ContractServiceImpl.class, OpenAIClientWrapper.class, ContractService.class})
class ContractServiceImplTest {

	@Autowired
	@InjectMocks
	private ContractServiceImpl contractService;

	@Mock
	OpenAIClientWrapper openAIClientWrapper;

	@Test
	void analyzeContract() throws Exception {

		// given
		String encodedImage = "";

		Mockito.when(openAIClientWrapper.request()).thenReturn(new ArrayList<>());

		// when

		// then
		assertThrows(Exception.class, () -> contractService.analyzeContract(encodedImage));
	}
}