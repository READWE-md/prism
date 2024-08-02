package com.readwe.gimisangung.contract.model.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@Document
@AllArgsConstructor
public class ContractAnalysisResult {

    private Long contractId;
    private List<Clause> clauses;
}
