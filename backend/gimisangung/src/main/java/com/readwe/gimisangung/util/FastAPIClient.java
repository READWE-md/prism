package com.readwe.gimisangung.util;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class FastAPIClient {

	@Value("${fastAPI.uri}")
	private static String URI;

	private static final RestTemplate restTemplate = new RestTemplate();
	private static final HttpHeaders headers = new HttpHeaders();

	public static ResponseEntity<?> sendRequest(Long contractId, List<String> images) {
		headers.setContentType(MediaType.APPLICATION_JSON);
		RequestBody requestBody = new RequestBody();
		requestBody.setImages(images);
<<<<<<< Updated upstream
		HttpEntity<RequestBody> httpEntity = new HttpEntity<>(requestBody, headers);
		return restTemplate.postForEntity(URI + contractId, httpEntity, String.class);
=======
		HttpEntity<RequestBody> httpEntity = new HttpEntity<>(requestBody, headers);clear
		return restTemplate.postForEntity(URI + "/" + contractId, httpEntity, String.class);
>>>>>>> Stashed changes
	}
}
