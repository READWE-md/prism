package com.readwe.gimisangung.contract.model.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.util.buf.Utf8Encoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.openai.models.ChatChoice;
import com.azure.ai.openai.models.ChatCompletions;
import com.azure.ai.openai.models.ChatCompletionsJsonResponseFormat;
import com.azure.ai.openai.models.ChatCompletionsOptions;
import com.azure.ai.openai.models.ChatMessageImageContentItem;
import com.azure.ai.openai.models.ChatMessageImageUrl;
import com.azure.ai.openai.models.ChatMessageTextContentItem;
import com.azure.ai.openai.models.ChatRequestMessage;
import com.azure.ai.openai.models.ChatRequestSystemMessage;
import com.azure.ai.openai.models.ChatRequestUserMessage;
import com.azure.ai.openai.models.ChatResponseMessage;
import com.azure.core.credential.AzureKeyCredential;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;

@Service
public class ContractServiceImpl implements ContractService {

	@Value("${openai.secret-key}")
	private String apiKey;

	@Override
	public AnalyzeResultDto analyzeContract(String encodedImage) {

		OpenAIClient openAIClient = new OpenAIClientBuilder()
			.credential(new AzureKeyCredential(apiKey))
			.endpoint("https://api.openai.com/v1/assistants")
			.buildClient();

		List<ChatRequestMessage> chatMessages = new ArrayList<>();

		chatMessages.add(new ChatRequestSystemMessage("너는 이미지로부터 텍스트를 추출해서 분석하는 도우미야. 텍스트 내용을 요약하고 독소조항들을 찾아줘"));
		chatMessages.add(new ChatRequestUserMessage(Arrays.asList(
			new ChatMessageTextContentItem("이 이미지를 분석해서 요약해줘. 그리고 독소조항이 있으면 알려줘. 응답은 JSON 형식으로 보내줘. 요약은 'summary'에 독소조항들은 'poisons'에 담아줘. 응답내용을 utf8로 인코딩해줘"),
			new ChatMessageImageContentItem(
				new ChatMessageImageUrl(encodedImage)
			)
		)));

		ChatCompletionsOptions chatCompletionsOptions = new ChatCompletionsOptions(chatMessages);
		chatCompletionsOptions.setMaxTokens(2048);
		chatCompletionsOptions.setResponseFormat(new ChatCompletionsJsonResponseFormat());
		ChatCompletions chatCompletions = openAIClient.getChatCompletions("gpt-4o", chatCompletionsOptions);

		AnalyzeResultDto analyzeResultDto = null;
		ObjectMapper objectMapper = new ObjectMapper();
		for (ChatChoice choice : chatCompletions.getChoices()) {
			ChatResponseMessage message = choice.getMessage();
			try {
				analyzeResultDto = objectMapper.readValue(message.getContent(), AnalyzeResultDto.class);
			} catch (JsonProcessingException e) {
				throw new RuntimeException(e);
			}
		}

		return analyzeResultDto;
	}
}
