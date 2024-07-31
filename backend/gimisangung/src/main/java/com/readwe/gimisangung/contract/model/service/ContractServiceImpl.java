package com.readwe.gimisangung.contract.model.service;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.azure.ai.openai.models.ChatChoice;
import com.azure.ai.openai.models.ChatResponseMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.readwe.gimisangung.contract.exception.ContractErrorCode;
import com.readwe.gimisangung.contract.model.dto.AnalyzeContractResultDto;
import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.Tag;
import com.readwe.gimisangung.contract.model.repository.ContractRepository;
import com.readwe.gimisangung.contract.model.repository.TagRepository;
import com.readwe.gimisangung.directory.exception.DirectoryErrorCode;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.repository.DirectoryRepository;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.repository.UserRepository;
import com.readwe.gimisangung.util.OpenAIClientWrapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

	private final ContractRepository contractRepository;
	private final DirectoryRepository directoryRepository;
	private final UserRepository userRepository;
	private final TagRepository tagRepository;
	private final OpenAIClientWrapper openAIClientWrapper;

	@Override
	public AnalyzeContractResultDto analyzeContract(List<String> encodedImages) {

		openAIClientWrapper.init();
		openAIClientWrapper.addSystemMessage("너는 이미지로부터 텍스트를 추출해서 분석하는 도우미야. 텍스트 내용을 요약하고 독소조항들을 찾아줘");
		openAIClientWrapper.addUserMessage("이 이미지를 분석해서 요약해줘. 그리고 독소조항이 있으면 알려줘. 응답은 JSON 형식으로 보내줘. 요약은 'summary'에 독소조항들은 'poisons'에 담아줘. 응답내용을 utf8로 인코딩해줘",
			encodedImages.get(0));
		List<ChatChoice> choices = openAIClientWrapper.request();

		AnalyzeContractResultDto analyzeContractResultDto = null;
		ObjectMapper objectMapper = new ObjectMapper();
		for (ChatChoice choice : choices) {
			ChatResponseMessage message = choice.getMessage();
			try {
				analyzeContractResultDto = objectMapper.readValue(message.getContent(), AnalyzeContractResultDto.class);
			} catch (JsonProcessingException e) {
				throw new RuntimeException(e);
			}
		}

		return analyzeContractResultDto;
	}

	@Override
	public List<Contract> getContractsByParentId(Long id, User user) {
		return List.of();
	}

	//TODO: tagService에서 tag 만드는 코드
	//TODO: contractService에서 Fast API에 분석 요청하는 코드
	@Override
	@Transactional
	public void createContract(User user, CreateContractRequestDto createContractRequestDto) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		Directory parent = directoryRepository.findById(createContractRequestDto.getParentId())
			.orElseThrow(() -> new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND));

		if (!parent.getUser().getId().equals(user.getId())) {
			throw new CustomException(UserErrorCode.FORBIDDEN);
		}

		if (contractRepository.existsByParentIdAndName(parent.getId(), createContractRequestDto.getName())) {
			throw new CustomException(ContractErrorCode.CONTRACT_EXISTS);
		}

		File userDirectory = makeLocalDirectory(user, createContractRequestDto, parent);

		try {
			saveImages(userDirectory, createContractRequestDto.getImages());
		} catch (IOException e) {
			throw new CustomException(DirectoryErrorCode.SAVE_FILE_FAILED);
		}

		Contract contract = Contract.builder()
			.name(createContractRequestDto.getName())
			.user(user)
			.parent(parent)
			.filePath(userDirectory.getPath())
			.build();

		Contract savedContract = contractRepository.save(contract);

		for (Tag tag : createContractRequestDto.getTags()) {
			tag.setContract(savedContract);
		}
		tagRepository.saveAll(createContractRequestDto.getTags());
	}

	private File makeLocalDirectory(User user, CreateContractRequestDto createContractRequestDto, Directory parent) {

		String filePath = "/resources/images/" + user.getId()
			+ "/" + parent.getId() + "/" + createContractRequestDto.getName() + "/";

		File userDirectory = new File(filePath);

		if (!userDirectory.mkdirs()) {
			throw new CustomException(DirectoryErrorCode.DIRECTORY_EXISTS_INTERNALLY);
		}

		return userDirectory;
	}

	private void saveImages(File userDirectory, List<String> images) throws IOException {
		for (int i = 0; i < images.size(); i++) {
			String image = images.get(i);

		}
	}
}
