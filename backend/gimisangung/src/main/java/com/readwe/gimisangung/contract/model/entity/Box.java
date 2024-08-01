package com.readwe.gimisangung.contract.model.entity;

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
public class Box {
	private Integer ltx;
	private Integer lty;
	private Integer rbx;
	private Integer rby;
	private Integer page;
}
