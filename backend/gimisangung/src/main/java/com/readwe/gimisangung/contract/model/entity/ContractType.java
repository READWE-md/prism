package com.readwe.gimisangung.contract.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractType {
	SAFE("safe"),
	CAUTION("caution"),
	DANGER("danger");
	private final String type;
}
