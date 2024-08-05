package com.readwe.gimisangung.user.model.service;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.OAuthLoginResponseDto;

public interface UserService {
	User login(String code);
}
