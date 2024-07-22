package com.readwe.gimisangung.user.model.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.readwe.gimisangung.user.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByEmail(String email);
}
