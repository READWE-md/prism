package com.readwe.gimisangung.contract.model.entity;

import java.util.List;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class Clause {
	private String type;
	private String content;
	private String result;
	private List<Box> boxes;
	private Double confident_score;
}
