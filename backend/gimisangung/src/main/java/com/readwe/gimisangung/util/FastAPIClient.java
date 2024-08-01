package com.readwe.gimisangung.util;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

public class FastAPIClient {

	private static final String URI = "http://localhost:3000";

	private final RestTemplate restTemplate = new RestTemplate();
	private final HttpHeaders headers = new HttpHeaders();

	private HttpEntity<RequestBody> httpEntity;

	public FastAPIClient() {
		headers.setContentType(MediaType.APPLICATION_JSON);
	}

	private void addRequestBody(RequestBody requestBody) {
		httpEntity = new HttpEntity<>(requestBody, headers);
	}

	private String sendRequest() {
		return restTemplate.postForObject(URI, httpEntity, String.class);
	}
}
