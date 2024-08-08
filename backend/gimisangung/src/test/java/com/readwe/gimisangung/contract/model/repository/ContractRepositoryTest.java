package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.readwe.gimisangung.contract.model.dto.ContractDto;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.ContractStatus;
import com.readwe.gimisangung.contract.model.entity.Tag;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.repository.UserRepository;

@SpringBootTest
public class ContractRepositoryTest {

	@Autowired
	private ContractRepository contractRepository;
	@Autowired
	private TagRepository tagRepository;
	@Autowired
	private UserRepository userRepository;

	@Test
	@Transactional
	@DisplayName("find test")
	void findAllByUserAndKeyword() {
		//given
		User user = User.builder()
			.build();
		Contract contract = Contract.builder()
			.user(user)
			.status(ContractStatus.UPLOAD)
			.name("contract1")
			.build();
		Contract contract2 = Contract.builder()
			.user(user)
			.status(ContractStatus.UPLOAD)
			.name("하도")
			.build();
		Tag tag1 = Tag.builder().contract(contract).name("tag1").build();
		Tag tag2 = Tag.builder().contract(contract).name("가나다라").build();
		Tag tag3 = Tag.builder().contract(contract).name("하도 급").build();
		Tag tag4 = Tag.builder().contract(contract2).name("가나다").build();
		Tag tag5 = Tag.builder().contract(contract2).name("하도 급").build();
		user = userRepository.save(user);
		contractRepository.save(contract);
		contractRepository.save(contract2);
		tagRepository.save(tag1);
		tagRepository.save(tag2);
		tagRepository.save(tag3);
		tagRepository.save(tag4);
		tagRepository.save(tag5);
		//when
		List<ContractDto> list = contractRepository.findAllByUserIdAndKeyword(user.getId(), "하도");

		//then
		Assertions.assertThat(list.size()).isEqualTo(2);
		Assertions.assertThat(list.getFirst().getTags()).isEqualTo(List.of("가나다", "하도 급"));
	}

}
