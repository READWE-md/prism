package com.readwe.gimisangung.directory.exception;

import org.springframework.http.HttpStatus;

import com.readwe.gimisangung.exception.CustomErrorCode;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DirectoryErrorCode implements CustomErrorCode {
	DIRECTORY_NOT_FOUND(HttpStatus.NOT_FOUND,"존재하지 않는 디렉토리입니다."),
	DIRECTORY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 디렉토리명입니다.");
	private final HttpStatus httpStatus;
	private final String errorMessage;
}
