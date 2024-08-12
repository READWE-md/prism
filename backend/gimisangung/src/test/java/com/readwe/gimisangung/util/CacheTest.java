package com.readwe.gimisangung.util;

import static org.mockito.ArgumentMatchers.*;

import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import com.readwe.gimisangung.contract.model.entity.Clause;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.ContractAnalysisResult;
import com.readwe.gimisangung.contract.model.entity.ImageDto;
import com.readwe.gimisangung.contract.model.repository.ContractAnalysisResultRepository;
import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.contract.model.service.ContractService;
import com.readwe.gimisangung.contract.model.service.TagService;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.image.model.Image;
import com.readwe.gimisangung.image.model.repository.ImageRepository;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.repository.UserRepository;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class CacheTest {

	@Autowired
	private UserRepository userRepository;

	@MockBean
	private ImageRepository imageRepository;

	@MockBean
	DirectoryRepository directoryRepository;

	@MockBean
	ContractAnalysisResultRepository contractAnalysisResultRepository;

	@Autowired
	ContractRepository contractRepository;

	@MockBean
	TagService tagService;

	@MockBean
	S3Service s3Service;

	@Autowired
	RedisRepository redisRepository;

	@Autowired
	private ContractService contractService;

	@Test
	@Transactional
	void getContractDetail() {
		//given
		User user = userRepository.save(new User());

		Contract contract = Contract.builder()
			.name("test")
			.user(user)
			.build();
		Contract savedContract = contractRepository.save(contract);
		Mockito.when(imageRepository.findAllByContractIdOrderById(savedContract.getId()))
			.thenReturn(List.of(new Image(1L, savedContract, "fileName")));
		Mockito.when(s3Service.getImages(any()))
			.thenReturn(List.of(new ImageDto(1, "base64")));
		Mockito.when(contractAnalysisResultRepository.findById(savedContract.getId()))
			.thenReturn(
				Optional.of(new ContractAnalysisResult(savedContract.getId(), List.of(new Clause()))
				)
			);

		//when
		contractService.getContractDetail(user, savedContract.getId());

		//then
		Assertions.assertThat(redisRepository.getData("contractDetail::"+savedContract.getId()))
			.isNotNull();

	}
}
