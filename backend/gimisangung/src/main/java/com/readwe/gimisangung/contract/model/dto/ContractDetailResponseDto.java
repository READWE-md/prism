package com.readwe.gimisangung.contract.model.dto;

import java.util.List;

import com.readwe.gimisangung.contract.model.entity.Clause;
import com.readwe.gimisangung.contract.model.entity.ImageDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractDetailResponseDto {
	private Long contractId;
	private List<ImageDto> images;
	private List<Clause> clauses;
}
