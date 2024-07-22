package com.readwe.gimisangung.contract.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.readwe.gimisangung.exception.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class ContractExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(ContractException.class)
	public ResponseEntity<?> handleGlobalException(ContractException e) {

		log.error("{} 에러 발생", e.getContractErrorCode().name());
		ErrorResponse response = ErrorResponse.builder()
			.errorCode(e.getErrorCode())
			.errorMessage(e.getErrorMessage())
			.build();

		return new ResponseEntity<>(response, e.getContractErrorCode().getHttpStatus());
	}

}
