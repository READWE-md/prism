package com.readwe.gimisangung.contract.model.dto;

import java.util.List;

import com.readwe.gimisangung.contract.model.entity.Poison;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeResultDto {
	private String summary;
	private List<Poison> poisons;
}
