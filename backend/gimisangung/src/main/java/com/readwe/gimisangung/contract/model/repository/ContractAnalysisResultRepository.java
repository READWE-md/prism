package com.readwe.gimisangung.contract.model.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.contract.model.entity.ContractAnalysisResult;

@Repository
public interface ContractAnalysisResultRepository extends MongoRepository<ContractAnalysisResult, Long> {
}
