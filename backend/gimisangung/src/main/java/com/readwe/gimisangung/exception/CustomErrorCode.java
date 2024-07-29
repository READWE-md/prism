package com.readwe.gimisangung.exception;

import org.springframework.http.HttpStatus;

public interface CustomErrorCode {
	HttpStatus getHttpStatus();
	String getErrorMessage();
}
