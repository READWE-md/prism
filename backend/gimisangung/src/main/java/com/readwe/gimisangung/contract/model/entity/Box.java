package com.readwe.gimisangung.contract.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Box {
	private Integer ltx;
	private Integer lty;
	private Integer rbx;
	private Integer rby;
}
