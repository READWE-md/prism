package com.readwe.gimisangung.user.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.readwe.gimisangung.exception.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class UserExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(UserException.class)
	public ResponseEntity<?> handleGlobalException(UserException e) {

		log.error("{} 에러 발생", e.getUserErrorCode().name());
		ErrorResponse response = ErrorResponse.builder()
			.errorCode(e.getErrorCode())
			.errorMessage(e.getErrorMessage())
			.build();

		return new ResponseEntity<>(response, e.getUserErrorCode().getHttpStatus());
	}

}
