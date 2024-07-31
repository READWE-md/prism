package com.readwe.gimisangung.contract.model.service;

import static org.mockito.ArgumentMatchers.*;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.entity.Tag;
import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.user.model.User;

@ExtendWith(MockitoExtension.class)
public class ContractServiceTest {

	@Mock
	private ContractRepository contractRepository;

	@Mock
	private DirectoryRepository directoryRepository;

	@InjectMocks
	private ContractService contractService;

	@Test
	@DisplayName("로컬 환경에 디렉토리를 생성할 수 있다.")
	void makeLocalDirectory() {

	}

	@Test
	@DisplayName("이미지를 저장할 수 있다.")
	void saveImage() {

	}

	@Test
	@DisplayName("계약서를 생성할 수 있다.")
	@Transactional
	void createContract() {
		//given
		User user = User.builder()
			.id(1L)
			.username("test")
			.email("test@test.com")
			.build();

		Directory directory = Directory.builder()
			.user(user)
			.id(1L)
			.build();

		List<String> images = new ArrayList<>();
		images.add("");

		List<Tag> tags = new ArrayList<>();
		tags.add(Tag.builder().name("test").build());

		CreateContractRequestDto dto = CreateContractRequestDto.builder()
			.name("test")
			.images(images)
			.tags(tags)
			.parentId(1L)
			.build();

		Mockito.when(directoryRepository.findById(any()))
			.thenReturn(Optional.of(directory));
		Mockito.when(contractRepository.existsByParentIdAndName(any(), any()))
			.thenReturn(false);

		//when
		contractService.createContract(user, dto);

		//then



	}


}
