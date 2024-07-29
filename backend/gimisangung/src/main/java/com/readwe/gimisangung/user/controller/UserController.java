package com.readwe.gimisangung.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readwe.gimisangung.user.model.dto.LoginUserDto;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;
import com.readwe.gimisangung.user.model.service.UserServiceImpl;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserServiceImpl userService;

	public UserController(UserServiceImpl userService) {
		this.userService = userService;
	}

	@PostMapping("login")
	public ResponseEntity<?> login(LoginUserDto loginUserDto) {
		if(userService.login(loginUserDto) == null){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<?> signup(SignupUserDto dto) {
		userService.signup(dto);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
