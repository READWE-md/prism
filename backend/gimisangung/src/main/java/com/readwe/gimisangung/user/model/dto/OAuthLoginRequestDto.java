package com.readwe.gimisangung.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OAuthLoginRequestDto {

	private String code;

	private String error;

	private String errorDescription;

	private String state;
}
