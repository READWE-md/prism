package com.readwe.gimisangung.user.model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;

@Getter
@Component
public class KakaoOAuthProperties {

	private final String grantType = "authorization_code";

	private String clientId;

	private String redirectURI;

	private String clientSecret;

	public KakaoOAuthProperties(@Value("${oauth.kakao.client_id}") String clientId, @Value("${oauth.kakao.redirect_uri}") String redirectURI, @Value("${oauth.kakao.client_secret}") String clientSecret) {
		this.clientId = clientId;
		this.redirectURI = redirectURI;
		this.clientSecret = clientSecret;
	}
}
