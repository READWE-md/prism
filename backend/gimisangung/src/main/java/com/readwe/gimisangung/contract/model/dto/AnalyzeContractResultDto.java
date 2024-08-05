package com.readwe.gimisangung.contract.model.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.EqualsAndHashCode;
import lombok.ToString;

@ToString
@EqualsAndHashCode
public class AnalyzeContractResultDto {
	private String summary;
	private List<String> poisons;

	public AnalyzeContractResultDto() {	}

	@JsonCreator
	public AnalyzeContractResultDto(@JsonProperty("summary") String summary, @JsonProperty("poisons") List<String> poisons) {
		this.summary = summary;
		this.poisons = poisons;
	}

	public String getSummary() {
		return summary;
	}

	public List<String> getPoisons() {
		return poisons;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public void setPoisons(List<String> poisons) {
		this.poisons = poisons;
	}
}
