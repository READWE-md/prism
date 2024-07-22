package com.readwe.gimisangung.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

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
import com.azure.core.credential.AzureKeyCredential;

@Component
public class OpenAIClientWrapper {

	@Value("${openai.secret-key}")
	private String apiKey;

	private OpenAIClient openAIClient;

	private List<ChatRequestMessage> messages = new ArrayList<>();

	public void init() {
		openAIClient = new OpenAIClientBuilder()
			.credential(new AzureKeyCredential(apiKey))
			.endpoint("https://api.openai.com/v1/assistants")
			.buildClient();
	}

	public void addSystemMessage(String message) {
		messages.add(new ChatRequestSystemMessage(message));
	}

	public void addUserMessage(String message) {
		messages.add(new ChatRequestUserMessage(message));
	}

	public void addUserMessage(String message, String encodedImage) {
		messages.add(new ChatRequestUserMessage(Arrays.asList(
			new ChatMessageTextContentItem(message),
			new ChatMessageImageContentItem(
				new ChatMessageImageUrl(encodedImage)
			)
		)));
	}

	public List<ChatChoice> request() {
		ChatCompletionsOptions options = new ChatCompletionsOptions(messages);
		options.setMaxTokens(2048);
		options.setResponseFormat(new ChatCompletionsJsonResponseFormat());

		ChatCompletions chatCompletions = openAIClient.getChatCompletions("gpt-4o", options);

		return chatCompletions.getChoices();
	}
}
