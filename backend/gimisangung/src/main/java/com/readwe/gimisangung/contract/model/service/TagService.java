package com.readwe.gimisangung.contract.model.service;

import java.util.List;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.Tag;

public interface TagService {
	List<Tag> saveTags(Contract contract, List<Tag> tags);
}
