package com.readwe.gimisangung;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GimisangungApplication {

	public static void main(String[] args) {
		SpringApplication.run(GimisangungApplication.class, args);
	}

}
