package com.readwe.gimisangung.contract.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.Tag;
import com.readwe.gimisangung.contract.model.repository.TagRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

	private final TagRepository tagRepository;

	@Override
	public void saveTags(Contract contract, List<Tag> tags) {
		for (Tag tag : tags) {
			tag.setContract(contract);
		}
		tagRepository.saveAll(tags);
	}
}
