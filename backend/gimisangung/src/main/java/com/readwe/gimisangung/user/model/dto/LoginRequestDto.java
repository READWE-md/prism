package com.readwe.gimisangung.user.model.dto;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@EqualsAndHashCode
@ToString
public class LoginRequestDto {
	private String email;

	@EqualsAndHashCode.Exclude
	private String password;
}
