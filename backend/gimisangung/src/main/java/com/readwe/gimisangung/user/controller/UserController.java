package com.readwe.gimisangung.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.readwe.gimisangung.directory.model.service.DirectoryService;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.LoginUserDto;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;
import com.readwe.gimisangung.user.model.service.UserService;
import com.readwe.gimisangung.user.model.service.UserServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserService userService;
	private final DirectoryService directoryService;

	@PostMapping("login")
	public ResponseEntity<?> login(LoginUserDto loginUserDto) {
		if(userService.login(loginUserDto) == null){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<?> signup(SignupUserDto dto) {
		User user = userService.signup(dto);

		directoryService.createRootDirectory(user);

		return new ResponseEntity<>(HttpStatus.OK);
	}
}
