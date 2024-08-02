package com.readwe.gimisangung.contract.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractStatus {
	FAIL("fail"),
	UPLOAD("upload"),
	ANALYZE("analyze"),
	DONE("done");
	private final String status;
}
