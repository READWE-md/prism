package com.readwe.gimisangung.contract.model.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.readwe.gimisangung.contract.model.entity.Poison;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@EqualsAndHashCode
public class AnalyzeResultDto {
	private String summary;
	private List<String> poisons;

	public AnalyzeResultDto() {	}

	@JsonCreator
	public AnalyzeResultDto(@JsonProperty("summary") String summary, @JsonProperty("poisons") List<String> poisons) {
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
