package com.readwe.gimisangung.contract.model.service;

import java.util.ArrayList;
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
	public List<Tag> saveTags(Contract contract, List<String> tags) {
		List<Tag> list = new ArrayList<>();
		for (String tag : tags) {
			list.add(Tag.builder()
				.name(tag)
				.contract(contract)
				.build());
		}

		return tagRepository.saveAll(list);
	}
}
