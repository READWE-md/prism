package com.readwe.gimisangung.user.model.repository;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.LoginUserDto;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
	User findUserByEmail(String email);
	boolean existsByEmail(String email);
}
