package com.readwe.gimisangung.util;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import lombok.Setter;

@Setter
public class FastAPIClient {

	private static final String URI = "http://localhost:3000/contract/";

	private final RestTemplate restTemplate = new RestTemplate();
	private final HttpHeaders headers = new HttpHeaders();

	private Long contractId;
	private List<String> images;

	public FastAPIClient() {
		headers.setContentType(MediaType.APPLICATION_JSON);
	}

	public String sendRequest() {
		HttpEntity<List<String>> httpEntity = new HttpEntity<>(images, headers);
		return restTemplate.postForObject(URI + contractId, httpEntity, String.class);
	}
}
