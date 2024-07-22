package com.readwe.gimisangung.exception;

import static org.mockito.ArgumentMatchers.*;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;

import com.readwe.gimisangung.user.controller.UserController;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.exception.UserException;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@EnableAutoConfiguration(exclude = SecurityAutoConfiguration.class)
public class UserExceptionHandlerTest {

	@Mock
	private UserController userController;

	@Test
	@DisplayName("UserException 작동 여부 확인")
	void userExistsException() {
		// given
		SignupUserDto dto = SignupUserDto.builder().build();

		// when
		Mockito.when(userController.signup(any()))
			.thenThrow(new UserException(UserErrorCode.USER_EXISTS));
		// then
		Assertions.assertThat(userController.signup(dto).getStatusCode())
			.isEqualTo(HttpStatus.CONFLICT);
	}

}
