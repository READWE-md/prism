package com.readwe.gimisangung.directory.exception;

import org.springframework.http.HttpStatus;

import com.readwe.gimisangung.exception.CustomErrorCode;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FileErrorCode implements CustomErrorCode {
	INVALID_FILE_NAME(HttpStatus.BAD_REQUEST, "올바르지 않은 파일 이름입니다."),
	CONVERT_IMAGE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "파일 변환에 실패했습니다."),
	GET_FILE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "파일 가져오기를 실패했습니다."),
	SAVE_FILE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장에 실패했습니다."),
	FOLDER_EXISTS(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내에 폴더가 이미 존재합니다.");
	private final HttpStatus httpStatus;
	private final String errorMessage;
}
