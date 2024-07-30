package com.readwe.gimisangung.user.model.service;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.LoginUserDto;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;
import com.readwe.gimisangung.user.model.dto.UserDto;

public interface UserService {
	UserDto login(LoginUserDto loginUserDto) throws RuntimeException;
	User signup(SignupUserDto dto) throws RuntimeException;
}
