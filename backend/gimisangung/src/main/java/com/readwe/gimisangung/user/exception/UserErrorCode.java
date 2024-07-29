package com.readwe.gimisangung.user.exception;

import org.springframework.http.HttpStatus;

import com.readwe.gimisangung.exception.CustomErrorCode;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UserErrorCode implements CustomErrorCode {
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
	FORBIDDEN(HttpStatus.FORBIDDEN, "권한이 없는 사용자입니다."),
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
	USER_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 이메일 또는 사용자입니다."),
	BAD_REQUEST(HttpStatus.BAD_REQUEST, "아이디 또는 비밀번호를 잘못 입력했습니다.");
	private final HttpStatus httpStatus;
	private final String errorMessage;
}
