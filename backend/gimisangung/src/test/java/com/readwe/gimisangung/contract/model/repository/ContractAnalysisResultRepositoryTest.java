// package com.readwe.gimisangung.contract.model.repository;
//
// import static org.junit.jupiter.api.Assertions.*;
//
// import java.util.ArrayList;
// import java.util.List;
// import java.util.Optional;
//
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
// import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
// import org.springframework.boot.test.context.SpringBootTest;
//
// import com.readwe.gimisangung.contract.model.entity.Box;
// import com.readwe.gimisangung.contract.model.entity.Clause;
// import com.readwe.gimisangung.contract.model.entity.ContractAnalysisResult;
//
// @SpringBootTest
// @AutoConfigureDataMongo
// class ContractAnalysisResultRepositoryTest {
//
// 	@Autowired
// 	private ContractAnalysisResultRepository contractAnalysisResultRepository;
//
// 	@Test
// 	@DisplayName("Read Test")
// 	void testFindById() {
// 		// Given
// 		Long id = 30L;
// 		Box box = new Box(10, 10, 10, 10, 10);
// 		Clause clause = new Clause("type", "content", "result", List.of(box), 0.8);
//
// 		ContractAnalysisResult saved = contractAnalysisResultRepository.save(ContractAnalysisResult.builder()
// 			.contractId(id)
// 			.clauses(List.of(clause))
// 			.build());
//
// 		// When
// 		ContractAnalysisResult contractAnalysisResult = contractAnalysisResultRepository.findById(id).orElse(null);
//
// 		// Then
// 		assertEquals(saved, contractAnalysisResult);
// 	}
// }