package com.readwe.gimisangung.contract.model.listener;

import java.time.LocalDateTime;

import com.readwe.gimisangung.contract.model.entity.Tag;

import jakarta.persistence.PostLoad;

public class TagListener {

	@PostLoad
	public void updateViewDate(Tag tag) {
		tag.setViewedAt(LocalDateTime.now());
	}
}
