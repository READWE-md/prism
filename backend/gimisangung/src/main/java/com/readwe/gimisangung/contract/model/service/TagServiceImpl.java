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
		if (tags.isEmpty()) {
			return new ArrayList<>();
		}

		List<Tag> list = tags.stream()
			.map(o -> Tag.builder().name(o).contract(contract).build())
			.toList();
		contract.setTags(list);

		return tagRepository.saveAll(list);
	}

	@Override
	public void saveInitialTags(Contract savedContract) {
		List<Tag> list = new ArrayList<>();
		for (int i = 0; i < 4; i++)	{
			list.add(Tag.builder().name("").contract(savedContract).build());
		}
		savedContract.setTags(list);
		tagRepository.saveAll(list);
	}
}