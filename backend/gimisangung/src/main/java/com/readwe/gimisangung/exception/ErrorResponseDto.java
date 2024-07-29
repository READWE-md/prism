package com.readwe.gimisangung.exception;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponseDto {
	private final String errorCode;
	private final String errorMessage;
	private final LocalDateTime time;
}
