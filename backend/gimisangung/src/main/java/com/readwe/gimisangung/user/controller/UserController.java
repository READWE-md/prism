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
import com.readwe.gimisangung.user.model.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserService userService;
	private final DirectoryService directoryService;

	@PostMapping("login")
	public ResponseEntity<?> login(LoginRequestDto loginRequestDto, HttpSession httpSession) {

		User loginUser = userService.login(loginRequestDto);

		httpSession.setAttribute("user", loginUser);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<?> signup(SignupRequestDto signupRequestDto, HttpSession httpSession) {
		User user = userService.signup(signupRequestDto);

		httpSession.setAttribute("user", user);

		directoryService.createRootDirectory(user);

		return new ResponseEntity<>(HttpStatus.OK);
	}


}
