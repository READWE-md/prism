package com.readwe.gimisangung.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class GlobalException extends RuntimeException {
	private final GlobalErrorCode globalErrorCode;
	private final String errorCode;
	private final String errorMessage;

	public GlobalException(GlobalErrorCode globalErrorCode) {
		this.globalErrorCode = globalErrorCode;
		this.errorCode = globalErrorCode.getHttpStatus().name();
		this.errorMessage = globalErrorCode.getErrorMessage();
	}
}
