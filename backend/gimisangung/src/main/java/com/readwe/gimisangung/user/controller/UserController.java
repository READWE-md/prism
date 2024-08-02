package com.readwe.gimisangung.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readwe.gimisangung.directory.model.service.DirectoryService;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.LoginRequestDto;
import com.readwe.gimisangung.user.model.dto.SignupRequestDto;
import com.readwe.gimisangung.user.model.dto.UserDto;
import com.readwe.gimisangung.user.model.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserService userService;

	@PostMapping("login")
	public ResponseEntity<?> login(LoginRequestDto loginRequestDto, HttpSession httpSession) {

		User user = userService.login(loginRequestDto);

		httpSession.setAttribute("user", user);

		return ResponseEntity.ok(new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRootDirId()));
	}

	@PostMapping
	public ResponseEntity<?> signup(SignupRequestDto signupRequestDto, HttpSession httpSession) {
		User user = userService.signup(signupRequestDto);

		httpSession.setAttribute("user", user);

		return ResponseEntity.ok(new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRootDirId()));
	}
}
