package com.readwe.gimisangung.user.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.SignupUserDto;
import com.readwe.gimisangung.user.model.repository.UserRepository;
import com.readwe.gimisangung.util.HashUtil;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	@Autowired
	public UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public boolean signup(SignupUserDto dto) throws RuntimeException {

		if (userRepository.existsByEmail(dto.getEmail())) {
			return false;
		}

		String salt = HashUtil.generateSalt();
		String password = HashUtil.computeSHA512(dto.getPassword() + salt);

		User user = User.builder()
			.username(dto.getUsername())
			.email(dto.getEmail())
			.password(password)
			.salt(salt)
			.build();

		userRepository.save(user);
		return true;
	}
}
