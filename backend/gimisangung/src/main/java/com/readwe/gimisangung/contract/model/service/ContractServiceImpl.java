package com.readwe.gimisangung.contract.model.service;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.ArrayList;
import java.util.List;

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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;

@Service
public class ContractServiceImpl implements ContractService {

	@Value("${openai.secret-key}")
	private String apiKey;

	@Override
	public AnalyzeResultDto analyzeContract(MultipartFile file) {

		OpenAIClient openAIClient = new OpenAIClientBuilder()
			.credential(new AzureKeyCredential(apiKey))
			.endpoint("https://api.openai.com/v1/assistants")
			.buildClient();

		Base64.Encoder encoder = Base64.getEncoder();

		String encodedImage = null;
		try {
			encodedImage = encoder.encodeToString(file.getBytes());
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

		List<ChatRequestMessage> chatMessages = new ArrayList<>();

		chatMessages.add(new ChatRequestSystemMessage("You are a helpful assistant that extracts text from image, summarizes the text and finds toxic clauses within the text"));
		chatMessages.add(new ChatRequestUserMessage(Arrays.asList(
			new ChatMessageTextContentItem("Analyze this image. Put the summary in 'summary' and the toxic clauses in 'poisons'. Respond in JSON format in Korean."),
			new ChatMessageImageContentItem(
				new ChatMessageImageUrl("data:image/jpeg;base64," + encodedImage)
			)
		)));

		ChatCompletionsOptions chatCompletionsOptions = new ChatCompletionsOptions(chatMessages);
		chatCompletionsOptions.setMaxTokens(2048);
		chatCompletionsOptions.setResponseFormat(new ChatCompletionsJsonResponseFormat());
		ChatCompletions chatCompletions = openAIClient.getChatCompletions("gpt-4o", chatCompletionsOptions);

		AnalyzeResultDto analyzeResultDto = null;
		ObjectMapper objectMapper = new ObjectMapper();
		AnalyzeResultDto.AnalyzeResultDtoBuilder analyzeResultDtoBuilder = AnalyzeResultDto.builder();
		for (ChatChoice choice : chatCompletions.getChoices()) {
			ChatResponseMessage message = choice.getMessage();
			analyzeResultDto = objectMapper.convertValue(message.getContent(), AnalyzeResultDto.class);
			analyzeResultDtoBuilder.summary(message.getContent());
		}

		return analyzeResultDto;
	}
}
