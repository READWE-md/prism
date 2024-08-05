package com.readwe.gimisangung.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readwe.gimisangung.user.model.dto.OAuthLoginResponseDto;
import com.readwe.gimisangung.user.model.dto.OAuthLoginRequestDto;
import com.readwe.gimisangung.user.model.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserService userService;

	@PostMapping("oauth/login")
	public ResponseEntity<?> login(@RequestBody OAuthLoginRequestDto oAuthLoginRequestDto) {

		if (!oAuthLoginRequestDto.getError().isBlank()) {
			throw new RuntimeException();
		}

		OAuthLoginResponseDto oAuthLoginResponseDto = userService.login(oAuthLoginRequestDto.getCode());

		return ResponseEntity.ok(oAuthLoginResponseDto);
	}
}
