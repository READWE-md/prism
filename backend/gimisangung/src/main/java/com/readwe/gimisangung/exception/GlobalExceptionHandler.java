package com.readwe.gimisangung.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(GlobalException.class)
	public ResponseEntity<?> handleGlobalException(GlobalException e) {

		log.error("{} 에러 발생", e.getGlobalErrorCode().name());
		ErrorResponse response = ErrorResponse.builder()
			.errorCode(e.getErrorCode())
			.errorMessage(e.getErrorMessage())
			.build();

		return new ResponseEntity<>(response, e.getGlobalErrorCode().getHttpStatus());
	}

}
