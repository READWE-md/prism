package com.readwe.gimisangung.util;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import lombok.Setter;

@Setter
public class FastAPIClient {

	@Value("${fastAPI.uri}")
	private String URI;

	private final RestTemplate restTemplate = new RestTemplate();
	private final HttpHeaders headers = new HttpHeaders();

	private Long contractId;
	private List<String> images;

	public FastAPIClient() {
		headers.setContentType(MediaType.APPLICATION_JSON);
	}

	public String sendRequest() {
		RequestBody requstBody = new RequestBody();
		requstBody.setImages(images);
		HttpEntity<RequestBody> httpEntity = new HttpEntity<>(requstBody, headers);
		return restTemplate.postForObject(URI + contractId, httpEntity, String.class);
	}
}
