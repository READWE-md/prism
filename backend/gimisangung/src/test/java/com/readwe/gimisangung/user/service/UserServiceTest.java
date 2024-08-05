// package com.readwe.gimisangung.user.service;
//
// import static org.assertj.core.api.Assertions.*;
//
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.Mockito;
//
// import org.mockito.junit.jupiter.MockitoExtension;
//
// import com.readwe.gimisangung.exception.CustomException;
// import com.readwe.gimisangung.user.model.User;
// import com.readwe.gimisangung.user.model.dto.LoginRequestDto;
// import com.readwe.gimisangung.user.model.dto.UserDto;
// import com.readwe.gimisangung.user.model.repository.UserRepository;
// import com.readwe.gimisangung.user.model.service.UserServiceImpl;
// import com.readwe.gimisangung.util.HashUtil;
//
// @ExtendWith(MockitoExtension.class)
// public class UserServiceTest {
//
// 	@Mock
// 	private UserRepository userRepository;
//
// 	@InjectMocks
// 	private UserServiceImpl userService;
//
// 	@Test
// 	@DisplayName("Login 기능 동작 여부 확인")
// 	void login() throws CustomException {
//
// 		// given
// 		final String email = "test1234@ssafy.com";
// 		final String password = "test_password";
// 		final String username = "test1234";
// 		final Long id = 1L;
// 		final String salt = "test_salt";
//
// 		LoginRequestDto loginUserDto = LoginRequestDto.builder()
// 			.email(email).password(password).build();
//
// 		String digest = HashUtil.getDigest(loginUserDto.getPassword() + "test_salt");
//
// 		User user = User.builder()
// 			.id(id).username(username).email(email).password(digest).salt(salt).build();
//
//
// 		// when
// 		UserDto userDto = UserDto.builder()
// 			.id(id).username(username).email(email).build();
//
// 		Mockito.when(userRepository.findUserByEmail(loginUserDto.getEmail()))
// 			.thenReturn(user);
//
// 		// then
// 		assertThat(userService.login(loginUserDto).getUsername()).isEqualTo(userDto.getUsername());
// 	}
// }
