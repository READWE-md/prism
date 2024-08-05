package com.readwe.gimisangung.user.model;

import org.springframework.beans.factory.annotation.Value;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class KakaoOAuthTokenRequstBody {

	private final String grant_type = "authorize_code";

	@Value("${oauth.kakao.client_id}")
	private String client_id;

	@Value("${oauth.kakao.redirect_uri}")
	private String redirect_uri;

	@Value("${oauth.kakao.client_secret}")
	private String client_secret;

	private String code;

	public KakaoOAuthTokenRequstBody(String code) {
		this.code = code;
	}
}
