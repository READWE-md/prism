package com.readwe.gimisangung.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum GlobalErrorCode implements CustomErrorCode {
	BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
	DUPLICATE_REQUEST(HttpStatus.CONFLICT, "중복된 요청입니다."),
	ILLEGAL_ARGUMENT(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "파일 형식이 맞지 않습니다.");
	private final HttpStatus httpStatus;
	private final String errorMessage;
}
