package com.readwe.gimisangung.contract.model.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@Document("contracts")
public class ContractAnalysisResult {

    @Id
    private Long contractId;

    @EqualsAndHashCode.Exclude
    private List<Clause> clauses;
}

