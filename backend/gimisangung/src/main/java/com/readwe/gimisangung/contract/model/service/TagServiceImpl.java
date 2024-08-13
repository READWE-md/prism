package com.readwe.gimisangung.contract.model.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.Tag;
import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.contract.model.repository.TagRepository;
import com.readwe.gimisangung.user.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

	private final TagRepository tagRepository;
	private final ContractRepository contractRepository;

	@Override
	public List<String> findTags(User user) {

		List<Tag> tags = tagRepository.findTop6ByUserIdOrderByViewedAt(user.getId());


		return tags.stream().map(Tag::getName).toList();
	}

	@Override
	public void saveTags(User user, Contract contract, List<String> tags) {
		tagRepository.deleteAllByContractId(contract.getId());

		List<Tag> list = tags.stream()
			.map(o -> Tag.builder().name(o).contract(contract).user(user).build())
			.toList();
		contract.getTags().clear();
		contract.getTags().addAll(list);

		tagRepository.saveAll(list);
	}

	@Override
	public void saveInitialTags(User user, Contract savedContract) {
		List<Tag> list = new ArrayList<>();
		for (int i = 0; i < 4; i++)	{
			list.add(Tag.builder().name("").contract(savedContract).user(user).build());
		}
		savedContract.getTags().addAll(list);

		tagRepository.saveAll(list);
	}
}