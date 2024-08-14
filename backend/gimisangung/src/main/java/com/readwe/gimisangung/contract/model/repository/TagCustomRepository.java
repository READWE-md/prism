package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.contract.model.entity.Tag;

@Repository
public interface TagCustomRepository {
	List<String> findTop6TagNames(Long userId);
	boolean updateViewedAt(List<Tag> tags);
}
