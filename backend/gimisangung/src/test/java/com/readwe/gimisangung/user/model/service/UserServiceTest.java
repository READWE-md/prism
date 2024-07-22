package com.readwe.gimisangung.user.model.service;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;
import com.readwe.gimisangung.user.model.repository.UserRepository;
import com.readwe.gimisangung.util.HashUtil;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

	@Autowired
	private UserRepository userRepository;

	@InjectMocks
	private UserServiceImpl userService;

	@Test
	@DisplayName("회원가입을 할 수 있다.")
	void signupUser() {
		//given
		SignupUserDto dto = SignupUserDto.builder()
			.username("test")
			.email("test@naver.com")
			.password("12345678")
			.build();

		String salt = HashUtil.generateSalt();
		String password = HashUtil.computeSHA512(dto.getPassword() + salt);

		User user = User.builder()
			.username(dto.getUsername())
			.email(dto.getEmail())
			.password(password)
			.salt(salt)
			.build();
		//when
		user = userRepository.save(user);

		//then
		Assertions.assertThat(userRepository.existsById(user.getId())).isTrue();

	}
}
