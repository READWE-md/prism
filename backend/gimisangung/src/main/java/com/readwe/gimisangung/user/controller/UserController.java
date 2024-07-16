package com.readwe.gimisangung.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readwe.gimisangung.user.model.dto.SignupUserDto;
import com.readwe.gimisangung.user.model.service.UserServiceImpl;

@RestController
@RequestMapping("/api")
public class UserController {

	private final UserServiceImpl userService;

	public UserController(UserServiceImpl userService) {
		this.userService = userService;
	}

	@PostMapping("/api/v1/users")
	public ResponseEntity<?> signup(SignupUserDto dto) {

		try {
			boolean result = userService.signup(dto);

			if (result) {
				return new ResponseEntity<>(HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.CONFLICT);
			}

		} catch (RuntimeException e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
