package com.readwe.gimisangung.user.model.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.readwe.gimisangung.user.exception.UserNotFoundException;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.LoginUserDto;
import com.readwe.gimisangung.user.model.dto.UserDto;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;
import com.readwe.gimisangung.user.model.repository.UserRepository;

import com.readwe.gimisangung.util.HashUtil;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	@Autowired
	public UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDto login(LoginUserDto loginUserDto) throws UserNotFoundException {
		// repository 조회
		User user = userRepository.findUserByEmailAndPassword(loginUserDto);

		// 해당하는 사용자가 없는 경우 null 반환
		if (user == null) {
			throw new UserNotFoundException();
		}

		// UserDto에 UserEntity 결과 입력
		UserDto userDto = UserDto.builder()
			.id(user.getId())
			.username(user.getUsername())
			.email(user.getEmail())
			.password(user.getPassword())
			.salt(user.getSalt())
			.build();

		// 입력받은 암호에 salt 값을 뒤에 붙여줌
		String saltedPassword = loginUserDto.getPassword() + user.getSalt();

		// entity의 digest 값과 같은지 확인
		if (HashUtil.getDigest(saltedPassword).equals(user.getPassword())) {
			return userDto;
		}
		throw new UserNotFoundException();
    }
    
    @Override
    public boolean signup(SignupUserDto dto) throws RuntimeException {

		if (userRepository.existsByEmail(dto.getEmail())) {
			return false;
		}

		String salt = HashUtil.generateSalt();
		String password = HashUtil.computeSHA512(dto.getPassword() + salt);

		UserEntity user = UserEntity.builder()
			.username(dto.getUsername())
			.email(dto.getEmail())
			.password(password)
			.salt(salt)
			.build();

		userRepository.save(user);
		return true;
	}
}
