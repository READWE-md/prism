package com.readwe.gimisangung.contract.model.service;

import java.util.List;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.user.model.User;

public interface TagService {
	List<String> findTags(User user);
	void saveTags(User user, Contract contract, List<String> tags);

	void saveInitialTags(User user, Contract savedContract);
}
