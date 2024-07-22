package com.readwe.gimisangung.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
	private String errorCode;
	private String errorMessage;
}
