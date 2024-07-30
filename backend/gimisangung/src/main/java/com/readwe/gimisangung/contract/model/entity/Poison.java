package com.readwe.gimisangung.contract.model.entity;

import java.util.List;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class Poison {
	private String content;
	private String result;

	@Embedded
	private List<Box> boxes;
}
