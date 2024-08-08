package com.readwe.gimisangung.contract.model.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

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
    @Field("_id")
    private Long contractId;

    @EqualsAndHashCode.Exclude
    private List<Clause> clauses;
}

