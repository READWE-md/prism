package com.readwe.gimisangung.contract.model.service;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.util.FastAPIClient;
import com.readwe.gimisangung.util.RedisRepository;
import com.readwe.gimisangung.util.S3Service;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class ContractServiceTest {
	@MockBean
	DirectoryRepository directoryRepository;

	@MockBean
	ContractRepository contractRepository;

	@MockBean
	TagService tagService;

	@MockBean
	S3Service s3Service;

	@Autowired
	RedisRepository redisRepository;

	@Autowired
	ContractService contractService;

	@Test
	@DisplayName("중복 요청이 들어오면 redis로 막는다")
	void duplicateRequest() {
		//given
		CreateContractRequestDto dto = CreateContractRequestDto.builder()
			.name("test")
			.parentId(1L)
			.images(new ArrayList<>())
			.build();
		User user = User.builder().id(1L).rootDirectoryId(1L).build();
		Directory parent = Directory.builder()
			.user(user)
			.parent(Directory.builder().user(user).id(1L).build())
			.build();

		Mockito.when(directoryRepository.findById(any())).thenReturn(Optional.ofNullable(parent));
		Mockito.when(contractRepository.existsByParentIdAndName(any(), any())).thenReturn(false);
		Mockito.when(contractRepository.save(any())).thenReturn(new Contract());
		MockedStatic<FastAPIClient> mockedStatic = mockStatic(FastAPIClient.class);
		mockedStatic.when(() -> FastAPIClient.sendRequest(any(), any())).thenReturn(ResponseEntity.status(HttpStatus.OK).build());
		//when
		contractService.createContract(user, dto);

		//then
		CustomException customException = Assertions.assertThrows(CustomException.class, () -> contractService.createContract(user, dto));
		Assertions.assertEquals(customException.errorMessage, "중복된 요청입니다.");
	}
}
