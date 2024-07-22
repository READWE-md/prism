package com.readwe.gimisangung.exception;

import static org.mockito.ArgumentMatchers.*;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;

import com.readwe.gimisangung.user.controller.UserController;
import com.readwe.gimisangung.user.exception.UserErrorCode;
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
