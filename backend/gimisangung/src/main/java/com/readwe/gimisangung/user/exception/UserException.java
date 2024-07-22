package com.readwe.gimisangung.user.exception;

import lombok.Getter;

@Getter
public class UserException extends RuntimeException {
	private final UserErrorCode userErrorCode;
	private final String errorCode;
	private final String errorMessage;

	public UserException(UserErrorCode userErrorCode) {
		this.userErrorCode = userErrorCode;
		this.errorCode = userErrorCode.getHttpStatus().name();
		this.errorMessage = userErrorCode.getErrorMessage();
	}
}
