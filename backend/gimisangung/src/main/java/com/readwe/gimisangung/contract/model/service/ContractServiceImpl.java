package com.readwe.gimisangung.contract.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.azure.ai.openai.models.ChatChoice;
import com.azure.ai.openai.models.ChatResponseMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.util.OpenAIClientWrapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

	private final OpenAIClientWrapper openAIClientWrapper;

	@Override
	public AnalyzeResultDto analyzeContract(List<String> encodedImages) {

		openAIClientWrapper.init();
		openAIClientWrapper.addSystemMessage("너는 이미지로부터 텍스트를 추출해서 분석하는 도우미야. 텍스트 내용을 요약하고 독소조항들을 찾아줘");
		openAIClientWrapper.addUserMessage("이 이미지를 분석해서 요약해줘. 그리고 독소조항이 있으면 알려줘. 응답은 JSON 형식으로 보내줘. 요약은 'summary'에 독소조항들은 'poisons'에 담아줘. 응답내용을 utf8로 인코딩해줘",
			encodedImages.get(0));
		List<ChatChoice> choices = openAIClientWrapper.request();

		AnalyzeResultDto analyzeResultDto = null;
		ObjectMapper objectMapper = new ObjectMapper();
		for (ChatChoice choice : choices) {
			ChatResponseMessage message = choice.getMessage();
			try {
				analyzeResultDto = objectMapper.readValue(message.getContent(), AnalyzeResultDto.class);
			} catch (JsonProcessingException e) {
				throw new RuntimeException(e);
			}
		}

		return analyzeResultDto;
	}

	@Override
	public List<Contract> getContractsByParentId(Long id, User user) {
		return List.of();
	}
}
