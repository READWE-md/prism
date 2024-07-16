package com.readwe.gimisangung.user.model.repository;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.LoginUserDto;

public interface UserRepository {
	User findUserByEmailAndPassword(LoginUserDto loginUserDto);
}
