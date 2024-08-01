package com.readwe.gimisangung.user.model.service;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.LoginRequestDto;
import com.readwe.gimisangung.user.model.dto.SignupRequestDto;

public interface UserService {
	User login(LoginRequestDto loginRequestDto) throws RuntimeException;
	User signup(SignupRequestDto signupRequestDto) throws RuntimeException;
}
