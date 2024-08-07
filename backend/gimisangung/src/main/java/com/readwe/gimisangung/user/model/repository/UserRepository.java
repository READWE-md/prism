package com.readwe.gimisangung.user.model.repository;

import com.readwe.gimisangung.user.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByOauthId(Long id);
	boolean existsByOauthId(Long id);
}
