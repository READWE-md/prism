package com.readwe.gimisangung.exception;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException {
	public final HttpStatus httpStatus;
	public final String errorCode;
	public final String errorMessage;

	public CustomException(CustomErrorCode customErrorCode) {
		this.httpStatus = customErrorCode.getHttpStatus();
		this.errorCode = customErrorCode.getHttpStatus().name();
		this.errorMessage = customErrorCode.getErrorMessage();
	}
}
