package com.readwe.gimisangung.contract.model.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.context.SpringBootTest;

import com.readwe.gimisangung.contract.model.entity.ContractAnalysisResult;

@SpringBootTest
@AutoConfigureDataMongo
class ContractAnalysisResultRepositoryTest {

	@Autowired
	private ContractAnalysisResultRepository contractAnalysisResultRepository;

	@Test
	@DisplayName("Read Test")
	void testFindById() {
		// Given
		Long id = 314848454L;

		// When
		ContractAnalysisResult contractAnalysisResult = contractAnalysisResultRepository.findById(id).orElse(null);

		// Then
		System.out.println(contractAnalysisResult);
		assertNotNull(contractAnalysisResult);
	}
}