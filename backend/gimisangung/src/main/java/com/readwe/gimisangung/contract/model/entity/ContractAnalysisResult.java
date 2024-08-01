package com.readwe.gimisangung.contract.model.entity;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@Document
@AllArgsConstructor
public class ContractAnalysisResult {

    private Long contractId;

    private String filePath;

    @Embedded
    private List<Poison> poison;

    private Double confidenceScore;
}
