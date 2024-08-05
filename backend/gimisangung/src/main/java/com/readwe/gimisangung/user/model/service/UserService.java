package com.readwe.gimisangung.user.model.service;

import com.readwe.gimisangung.user.model.dto.OAuthLoginResponseDto;

public interface UserService {
	// User login(LoginRequestDto loginRequestDto) throws RuntimeException;
	// User signup(SignupRequestDto signupRequestDto) throws RuntimeException;
	OAuthLoginResponseDto login(String code);
}
