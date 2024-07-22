package com.readwe.gimisangung.contract.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractErrorCode {
	CONTRACT_NOT_FOUND(HttpStatus.NOT_FOUND,"존재하지 않는 계약서입니다."),
	CONTRACT_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 계약서입니다.");
	private final HttpStatus httpStatus;
	private final String errorMessage;
}