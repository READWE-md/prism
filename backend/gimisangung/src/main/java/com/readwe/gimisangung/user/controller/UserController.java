package com.readwe.gimisangung.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.OAuthLoginResponseDto;
import com.readwe.gimisangung.user.model.dto.OAuthLoginRequestDto;
import com.readwe.gimisangung.user.model.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class UserController {

	private final UserService userService;

	@PostMapping("/api/v1/oauth/login")
	public ResponseEntity<?> login(@RequestBody OAuthLoginRequestDto oAuthLoginRequestDto, HttpSession session) {

		if (oAuthLoginRequestDto.getError() != null) {
			throw new RuntimeException();
		}

		User user = userService.login(oAuthLoginRequestDto.getCode());



		return ResponseEntity.ok(oAuthLoginResponseDto);
	}
}
