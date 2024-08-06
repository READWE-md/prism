package com.readwe.gimisangung.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(CustomException.class)
	public ResponseEntity<?> handleCustomException(CustomException e) {
		log.error("에러 발생 - {}, {} at {}", e.errorCode, e.errorMessage, e.getStackTrace()[0]);
		ErrorResponseDto response = ErrorResponseDto.builder()
			.errorCode(e.errorCode)
			.errorMessage(e.errorMessage)
			.time(LocalDateTime.now())
			.build();
		return new ResponseEntity<>(response, e.httpStatus);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleUncaughtException(Exception e) {
		log.error("내부 에러 발생 - {}, {} at {}", e.getCause(), e.getMessage(), e.getStackTrace()[0]);
		e.printStackTrace();

		return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
