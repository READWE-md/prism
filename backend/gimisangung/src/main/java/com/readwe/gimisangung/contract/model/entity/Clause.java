package com.readwe.gimisangung.contract.model.entity;

import java.util.List;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@Embeddable
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Clause {
	private String type;
	private String content;
	private String result;
	private List<Box> boxes;
	private Double confident_score;
}
