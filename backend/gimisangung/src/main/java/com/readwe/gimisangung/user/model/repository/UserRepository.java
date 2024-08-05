package com.readwe.gimisangung.user.model.repository;

import com.readwe.gimisangung.user.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	// User findUserByEmail(String email);
	// boolean existsByEmail(String email);
	boolean existsByOauthId(Long id);
}
