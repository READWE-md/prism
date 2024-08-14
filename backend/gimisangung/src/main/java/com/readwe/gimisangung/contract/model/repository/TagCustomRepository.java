package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public interface TagCustomRepository {
	List<String> findTop6TagNames(Long userId);
}
