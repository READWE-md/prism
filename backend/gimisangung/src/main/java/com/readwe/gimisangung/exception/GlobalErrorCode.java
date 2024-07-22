package com.readwe.gimisangung.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum GlobalErrorCode {
	CUSTOM_EXCEPTION(HttpStatus.BAD_REQUEST, "이 형식으로 작성하면 됩니다.");
	private final HttpStatus httpStatus;
	private final String errorMessage;
}
