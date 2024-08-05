// package com.readwe.gimisangung.directory.controller;
//
// import static org.junit.jupiter.api.Assertions.*;
//
// import org.junit.jupiter.api.BeforeAll;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.web.client.RestTemplate;
//
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.readwe.gimisangung.directory.model.service.DirectoryService;
// import com.readwe.gimisangung.user.model.User;
//
// @SpringBootTest
// @AutoConfigureMockMvc
// class DirectoryControllerTest {
//
// 	@Autowired
// 	private MockMvc mockMvc;
//
// 	@Autowired
// 	private ObjectMapper objectMapper;
//
// 	@Autowired
// 	private static DirectoryService directoryService;
//
// 	private static User user;
//
// 	@BeforeAll
// 	static void before() {
// 		user = User.builder()
// 			.username("test")
// 			.email("email")
// 			.password("password")
// 			.salt("salt")
// 			.build();
//
// 		directoryService.createRootDirectory(user);
// 	}
//
// 	@Test
// 	void updateDirectory() {
//
//
// 	}
// }