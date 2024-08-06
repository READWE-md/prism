package com.readwe.gimisangung.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.OAuthLoginResponseDto;
import com.readwe.gimisangung.user.model.dto.OAuthLoginRequestDto;
import com.readwe.gimisangung.user.model.dto.UserDto;
import com.readwe.gimisangung.user.model.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@PostMapping("api/v1/oauth/login")
	public ResponseEntity<?> login(@RequestBody OAuthLoginRequestDto oAuthLoginRequestDto, HttpSession session) {

		if (oAuthLoginRequestDto.getError() != null) {
			throw new RuntimeException();
		}

		UserDto userDto = userService.login(oAuthLoginRequestDto.getCode());

		User user = User.builder()
			.id(userDto.getId())
			.oauthId(userDto.getOauthId())
			.accessToken(userDto.getAccessToken())
			.expiresIn(userDto.getExpiresIn())
			.refreshToken(userDto.getRefreshToken())
			.refreshExpiresIn(userDto.getRefreshExpiresIn())
			.rootDirectoryId(userDto.getRootDirectoryId())
			.build();

		session.setAttribute("user", user);

		return ResponseEntity.ok(new OAuthLoginResponseDto(userDto.getId(), userDto.getRootDirectoryId(), userDto.getUsername(), userDto.getProfileImageUrl()));
	}
}
