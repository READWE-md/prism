package com.readwe.gimisangung.exception;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.readwe.gimisangung.user.controller.UserController;
import com.readwe.gimisangung.user.exception.UserException;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;

@SpringBootTest
public class UserExceptionHandlerTest {

	@Autowired
	private UserController userController;

	@Test
	@DisplayName("UserException 작동 여부 확인")
	void userExistsException() {
		// given
		SignupUserDto dto = SignupUserDto.builder()
			.username("test")
			.email("test@test.com")
			.password("password")
			.build();

		// when
		userController.signup(dto);

		// then
		Assertions.assertThrows(UserException.class, () -> userController.signup(dto));
	}

	@Test
	@DisplayName("정상 작동시 Handler 작동 여부 확인")
	void noException() {
		// given
		SignupUserDto dto = SignupUserDto.builder()
			.username("test")
			.email("test@test.com")
			.password("password")
			.build();

		// when

		// then
		Assertions.assertDoesNotThrow(() -> userController.signup(dto));
	}

}
