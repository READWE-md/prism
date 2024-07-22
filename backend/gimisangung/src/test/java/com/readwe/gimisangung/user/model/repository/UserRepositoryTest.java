package com.readwe.gimisangung.user.model.repository;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@DataJpaTest
@EnableJpaRepositories
@EnableAutoConfiguration(exclude = SecurityAutoConfiguration.class)
public class UserRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@Test
	void connect() {
		Assertions.assertThat(userRepository.existsById(1L)).isFalse();
	}

}
