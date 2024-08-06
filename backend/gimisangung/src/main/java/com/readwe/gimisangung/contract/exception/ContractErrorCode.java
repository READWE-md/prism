package com.readwe.gimisangung.contract.exception;

import org.springframework.http.HttpStatus;

import com.readwe.gimisangung.exception.CustomErrorCode;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ContractErrorCode implements CustomErrorCode {
	CONTRACT_NOT_FOUND(HttpStatus.NOT_FOUND,"존재하지 않는 계약서입니다."),
	CONTRACT_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 계약서입니다."),
	INVALID_KEYWORD(HttpStatus.BAD_REQUEST, "올바르지 않은 검색어입니다."),
	UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "올바른 형식의 파일이 아닙니다."),
	CONTRACT_NOT_ANALYZED(HttpStatus.SERVICE_UNAVAILABLE, "아직 분석되지 않은 계약서입니다.");
	private final HttpStatus httpStatus;
	private final String errorMessage;
}