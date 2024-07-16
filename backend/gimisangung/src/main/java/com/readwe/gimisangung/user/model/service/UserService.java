package com.readwe.gimisangung.user.model.service;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.user.model.dto.SignupUserDto;

@Service
public interface UserService {
	boolean signup(SignupUserDto dto) throws Exception;
}
