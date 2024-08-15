package com.readwe.gimisangung.contract.model.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.readwe.gimisangung.contract.model.dto.ContractDto;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.ContractStatus;
import com.readwe.gimisangung.contract.model.entity.Tag;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.repository.UserRepository;

@SpringBootTest
public class ContractRepositoryTest {

	@Autowired
	private DirectoryRepository directoryRepository;
	@Autowired
	private ContractRepository contractRepository;
	@Autowired
	private TagRepository tagRepository;
	@Autowired
	private UserRepository userRepository;

	private User user;
	private Directory parent;
	private Contract first;
	private Contract second;
	private List<Tag> firstTags;
	private List<Tag> secondTags;

	@BeforeEach
	public void setContext() {
		user = userRepository.save(User.builder()
			.build());

		parent = directoryRepository.save(Directory.builder()
			.user(user)
			.build());

		user.setRootDirectoryId(parent.getId());

		first = contractRepository.save(Contract.builder()
			.status(ContractStatus.DONE)
			.name("keyword")
			.createdAt(LocalDateTime.now())
			.viewedAt(LocalDateTime.now())
			.startDate(LocalDateTime.now())
			.expireDate(LocalDateTime.now())
			.tags(new ArrayList<>())
			.parent(parent)
			.user(user)
			.build());

		second = contractRepository.save(Contract.builder()
			.status(ContractStatus.DONE)
			.name("contract")
			.createdAt(LocalDateTime.now())
			.viewedAt(LocalDateTime.now().plusDays(5))
			.startDate(LocalDateTime.now().plusDays(5))
			.expireDate(LocalDateTime.now().plusDays(6))
			.tags(new ArrayList<>())
			.parent(parent)
			.user(user)
			.build());

		firstTags = new ArrayList<>();
		secondTags = new ArrayList<>();
		for (int i = 0; i < 4; i++) {
			firstTags.add(Tag.builder().name("tag"+i).contract(first).build());
		}
		secondTags.add(Tag.builder().name("key").contract(second).build());
		secondTags.add(Tag.builder().name("word").contract(second).build());
		tagRepository.saveAll(firstTags);
		tagRepository.saveAll(secondTags);
		first.getTags().addAll(firstTags);
		second.getTags().addAll(secondTags);
	}

	@Test
	@Transactional
	@DisplayName("findByParams with no params test(findAll)")
	void findAll() {
		Map<String, Object> params = new HashMap<>();

		//when
		List<ContractDto> contracts = contractRepository.findByUserIdAndParams(user.getId(), params);

		//then
		Assertions.assertThat(contracts.getFirst().getName())
			.isEqualTo(second.getName());
		Assertions.assertThat(contracts.getLast().getTags()
			.getFirst()).isEqualTo(firstTags.getFirst().getName());
	}

	@Test
	@Transactional
	@DisplayName("findByParams startDate-endDate test")
	void findByDate() {
		LocalDateTime startDate = LocalDateTime.now().minusWeeks(1);
		LocalDateTime endDate = LocalDateTime.now().plusWeeks(1);
		Map<String, Object> params = new HashMap<>();
		params.put("startDate", startDate);
		params.put("endDate", endDate);

		//when
		List<ContractDto> contracts = contractRepository.findByUserIdAndParams(user.getId(), params);

		//then
		Assertions.assertThat(contracts.getFirst().getName())
			.isEqualTo(second.getName());
		Assertions.assertThat(contracts.getLast().getTags()
			.getFirst()).isEqualTo(firstTags.getFirst().getName());
	}

	@Test
	@Transactional
	@DisplayName("findByParams startDate-endDate 밖일 시 안가져옴")
	void findByDateOutOfRange() {
		LocalDateTime startDate = LocalDateTime.now().minusWeeks(1);
		LocalDateTime endDate = LocalDateTime.now();
		Map<String, Object> params = new HashMap<>();
		params.put("startDate", startDate);
		params.put("endDate", endDate);

		//when
		List<ContractDto> contracts = contractRepository.findByUserIdAndParams(user.getId(), params);

		//then
		Assertions.assertThat(contracts.getFirst().getName())
			.isEqualTo(first.getName());
		Assertions.assertThat(contracts.getLast().getTags()
			.getFirst()).isEqualTo(firstTags.getFirst().getName());
	}

	@Test
	@Transactional
	@DisplayName("시작일이 검색시작일 전이고 만료일이 없을 때 가져오기")
	void getDateIfStartDateBeforeStartAndExpireDateIsNull() {
		//given
		List<Tag> tags = new ArrayList<>();
		tags.add(Tag.builder().name("name").build());
		tagRepository.saveAll(tags);
		Contract third = contractRepository.save(Contract.builder()
			.status(ContractStatus.DONE)
			.name("contract")
			.createdAt(LocalDateTime.now())
			.viewedAt(LocalDateTime.now().plusDays(10))
			.startDate(LocalDateTime.now().minusWeeks(2))
			.tags(new ArrayList<>())
			.parent(parent)
			.user(user)
			.build());
		tags.getFirst().setContract(third);
		third.getTags().addAll(tags);

		LocalDateTime startDate = LocalDateTime.now().minusWeeks(1);
		LocalDateTime endDate = LocalDateTime.now();
		Map<String, Object> params = new HashMap<>();
		params.put("startDate", startDate);
		params.put("endDate", endDate);

		//when
		List<ContractDto> contracts = contractRepository.findByUserIdAndParams(user.getId(), params);

		//then
		for (ContractDto dto : contracts) {
			System.out.println(dto);
		}
		Assertions.assertThat(contracts.getFirst().getName())
			.isEqualTo(third.getName());
	}

	@Test
	@Transactional
	@DisplayName("findByParams keyword test")
	void findByKeyword() {
		//given
		Map<String, Object> params = new HashMap<>();
		params.put("keyword", "key");

		//when
		List<ContractDto> contracts = contractRepository.findByUserIdAndParams(user.getId(), params);

		//then
		Assertions.assertThat(contracts.getFirst().getName())
			.isEqualTo(second.getName());
		Assertions.assertThat(contracts.getFirst().getTags().size())
				.isEqualTo(2);
		Assertions.assertThat(contracts.getLast().getTags()
			.getFirst()).isEqualTo(firstTags.getFirst().getName());
	}

	@Test
	@Transactional
	@DisplayName("findByParams noTag test")
	void findByKeywordNoTag() {
		//given
		Map<String, Object> params = new HashMap<>();
		params.put("keyword", "key");

		//when
		List<ContractDto> contracts = contractRepository.findByUserIdAndParams(user.getId(), params);

		//then
		Assertions.assertThat(contracts.getFirst().getName())
			.isEqualTo(second.getName());
		Assertions.assertThat(contracts.getFirst().getTags().size())
			.isEqualTo(2);
		Assertions.assertThat(contracts.getLast().getTags()
			.getFirst()).isEqualTo(firstTags.getFirst().getName());
	}

	@Test
	@Transactional
	@DisplayName("tag viewedAt update test")
	void tagViewedAtUpdate() {
		//given
		Map<String, Object> params = new HashMap<>();
		params.put("keyword", "key");

		//when
		List<ContractDto> contracts = contractRepository.findByUserIdAndParams(user.getId(), params);
		Tag tag = tagRepository.findAllByContractId(second.getId()).getFirst();

		//then
		Assertions.assertThat(tag.getViewedAt())
			.isNotNull();
	}

	// @Test
	// @Transactional
	// @DisplayName("find test")
	// void findAllByUserAndKeyword() {
	// 	//given
	// 	User user = User.builder()
	// 		.build();
	// 	Contract contract = Contract.builder()
	// 		.user(user)
	// 		.name("contract1")
	// 		.build();
	// 	Contract contract2 = Contract.builder()
	// 		.user(user)
	// 		.name("하도")
	// 		.build();
	// 	Tag tag1 = Tag.builder().contract(contract).name("tag1").build();
	// 	Tag tag2 = Tag.builder().contract(contract).name("가나다라").build();
	// 	Tag tag3 = Tag.builder().contract(contract).name("하도 급").build();
	// 	Tag tag4 = Tag.builder().contract(contract2).name("가나다").build();
	// 	Tag tag5 = Tag.builder().contract(contract2).name("하도 급").build();
	// 	user = userRepository.save(user);
	// 	contractRepository.save(contract);
	// 	contractRepository.save(contract2);
	// 	tagRepository.save(tag1);
	// 	tagRepository.save(tag2);
	// 	tagRepository.save(tag3);
	// 	tagRepository.save(tag4);
	// 	tagRepository.save(tag5);
	// 	//when
	// 	List<ContractDto> list = contractRepository.findAllByUserIdAndKeyword(user.getId(), "하도");
	//
	// 	//then
	// 	Assertions.assertThat(list.size()).isEqualTo(2);
	// 	Assertions.assertThat(list.getFirst().getTags()).isEqualTo(List.of("가나다", "하도 급"));
	// }

}
