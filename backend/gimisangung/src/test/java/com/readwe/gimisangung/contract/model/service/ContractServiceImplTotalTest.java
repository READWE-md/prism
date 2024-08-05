// package com.readwe.gimisangung.contract.model.service;
//
// import static org.mockito.ArgumentMatchers.anyList;
// import static org.mockito.ArgumentMatchers.anyLong;
// import static org.mockito.ArgumentMatchers.anyString;
// import static org.mockito.Mockito.*;
//
// import java.io.File;
// import java.util.ArrayList;
// import java.util.List;
//
// import org.assertj.core.api.Assertions;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.MockedStatic;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.transaction.annotation.Transactional;
//
// import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
// import com.readwe.gimisangung.contract.model.entity.Contract;
// import com.readwe.gimisangung.contract.model.entity.Tag;
// import com.readwe.gimisangung.contract.model.repository.ContractRepository;
// import com.readwe.gimisangung.directory.model.entity.Directory;
// import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
// import com.readwe.gimisangung.user.model.User;
// import com.readwe.gimisangung.user.model.repository.UserRepository;
// import com.readwe.gimisangung.util.FileUtil;
//
// @SpringBootTest
// @Transactional
// @ExtendWith(MockitoExtension.class)
// public class ContractServiceImplTotalTest {
//
// 	@Autowired
// 	private ContractService contractService;
//
// 	@Autowired
// 	private UserRepository userRepository;
//
// 	@Autowired
// 	private DirectoryRepository directoryRepository;
// 	@Autowired
// 	private ContractRepository contractRepository;
//
// 	@Test
// 	@DisplayName("계약서 저장의 전 과정을 진행할 수 있다")
// 	void createContract() {
// 		//given
// 		User u = User.builder()
// 			.id(1L)
// 			.username("test")
// 			.email("test@test.com")
// 			.build();
//
// 		Directory d = Directory.builder()
// 			.user(u)
// 			.id(1L)
// 			.build();
//
// 		User user = userRepository.save(u);
// 		Directory directory = directoryRepository.save(d);
//
// 		List<String> images = new ArrayList<>();
// 		images.add("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");
//
// 		List<String> tags = new ArrayList<>();
// 		tags.add("test");
//
// 		CreateContractRequestDto dto = CreateContractRequestDto.builder()
// 			.name("test")
// 			.images(images)
// 			.tags(tags)
// 			.parentId(directory.getId())
// 			.build();
//
// 		MockedStatic<FileUtil> mockedStatic = mockStatic(FileUtil.class);
// 		mockedStatic.when(() -> FileUtil.createFolder(anyLong(), anyLong(), anyString()))
// 			.thenReturn(new File("test/file/path"));
// 		mockedStatic.when(() -> FileUtil.saveImages(anyString(), anyList())).then(invocation -> null);
//
// 		//when
// 		Contract contract = contractService.createContract(user, dto);
//
// 		//then
// 		Assertions.assertThat(contractRepository.existsById(contract.getId()))
// 			.isTrue();
//
// 	}
// }
