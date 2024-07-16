package com.readwe.gimisangung.user.model.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignupUserDto {
	@Column(length = 15)
	private String username;

	@Column(length = 32)
	private String email;

	@Column(length = 64)
	private String password;
}
