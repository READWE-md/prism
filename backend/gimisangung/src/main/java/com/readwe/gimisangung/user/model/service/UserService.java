package com.readwe.gimisangung.user.model.service;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.OAuthLoginResponseDto;
import com.readwe.gimisangung.user.model.dto.UserDto;

public interface UserService {
	UserDto login(String code);
}
