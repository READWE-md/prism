package com.readwe.gimisangung.contract.model.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@Document("contract_analysis_collection")
public class ContractAnalysisResult {

    @Id
    private Long contractId;

    private List<Clause> clauses;

    private Double confidenceScore;
}

