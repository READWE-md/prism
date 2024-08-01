package com.readwe.gimisangung.user.model.service;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;

import com.readwe.gimisangung.user.model.dto.LoginRequestDto;
import com.readwe.gimisangung.user.model.dto.SignupRequestDto;
import com.readwe.gimisangung.user.model.repository.UserRepository;

import com.readwe.gimisangung.util.HashUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	@Override
	public User login(LoginRequestDto loginRequestDto) throws RuntimeException {
		// repository 조회
		User user = userRepository.findUserByEmail(loginRequestDto.getEmail());

		// 해당하는 사용자가 없는 경우 null 반환
		if (user == null) {
			throw new CustomException(UserErrorCode.USER_NOT_FOUND);
		}

		// 입력받은 암호에 salt 값을 뒤에 붙여줌
		String saltedPassword = loginRequestDto.getPassword() + user.getSalt();

		// entity의 digest 값과 같은지 확인
		if (!HashUtil.getDigest(saltedPassword).equals(user.getPassword())) {
			throw new CustomException(UserErrorCode.BAD_REQUEST);
		}

		return user;
    }
    
    @Override
    public User signup(SignupRequestDto signupRequestDto) throws RuntimeException {

		if (userRepository.existsByEmail(signupRequestDto.getEmail())) {
			throw new CustomException(UserErrorCode.USER_EXISTS);
		}

		String salt = HashUtil.generateSalt();
		String password = HashUtil.getDigest(signupRequestDto.getPassword() + salt);

		User user = User.builder()
			.username(signupRequestDto.getUsername())
			.email(signupRequestDto.getEmail())
			.password(password)
			.salt(salt)
			.build();

		return userRepository.save(user);
	}
}
