package com.readwe.gimisangung.contract.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.readwe.gimisangung.contract.model.service.TagService;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tags")
public class TagController {

	private final TagService tagService;

	@GetMapping
	public ResponseEntity<?> findTags(@SessionAttribute("user") User user) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		List<String> tags = tagService.findTop6TagNames(user);

		return ResponseEntity.ok(tags);
	}
}
