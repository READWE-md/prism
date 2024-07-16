package com.readwe.gimisangung.user.model.repository;

import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.dto.LoginUserDto;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
	User findUserByEmailAndPassword(LoginUserDto loginUserDto);
	boolean existsByEmail(String email);
}
