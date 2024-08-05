// package com.readwe.gimisangung.user.model.repository;
//
// import org.assertj.core.api.Assertions;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
// import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
// import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
// import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//
// import com.readwe.gimisangung.user.model.User;
// import com.readwe.gimisangung.user.model.dto.SignupRequestDto;
// import com.readwe.gimisangung.user.model.service.UserServiceImpl;
// import com.readwe.gimisangung.util.HashUtil;
//
// @DataJpaTest
// @EnableJpaRepositories
// @EnableAutoConfiguration(exclude = SecurityAutoConfiguration.class)
// @ExtendWith(MockitoExtension.class)
// public class UserRepositoryTest {
//
// 	@Autowired
// 	private UserRepository userRepository;
//
// 	@InjectMocks
// 	private UserServiceImpl userService;
//
// 	@Test
// 	void connect() {
// 		Assertions.assertThat(userRepository.existsById(1L)).isFalse();
// 	}
//
// 	@Test
// 	@DisplayName("회원가입을 할 수 있다.")
// 	void signupUser() {
// 		// //given
// 		// SignupRequestDto dto = SignupRequestDto.builder()
// 		// 	.username("test")
// 		// 	.email("test@naver.com")
// 		// 	.password("12345678")
// 		// 	.build();
// 		//
// 		// String salt = HashUtil.generateSalt();
// 		// String password = HashUtil.getDigest(dto.getPassword() + salt);
// 		//
// 		// User user = User.builder()
// 		// 	.username(dto.getUsername())
// 		// 	.email(dto.getEmail())
// 		// 	.password(password)
// 		// 	.salt(salt)
// 		// 	.build();
// 		// //when
// 		// user = userRepository.save(user);
// 		//
// 		// //then
// 		// Assertions.assertThat(userRepository.existsById(user.getId())).isTrue();
//
// 	}
//
// }
