package com.readwe.gimisangung.user.model.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.user.model.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
	boolean existsByEmail(String email);
}
