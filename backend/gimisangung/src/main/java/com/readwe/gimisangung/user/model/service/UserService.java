package com.readwe.gimisangung.user.model.service;

import com.readwe.gimisangung.user.exception.UserNotFoundException;
import com.readwe.gimisangung.user.model.dto.LoginUserDto;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;
import com.readwe.gimisangung.user.model.dto.UserDto;

public interface UserService {
	UserDto login(LoginUserDto loginUserDto) throws UserNotFoundException;
	boolean signup(SignupUserDto dto) throws Exception;
}
