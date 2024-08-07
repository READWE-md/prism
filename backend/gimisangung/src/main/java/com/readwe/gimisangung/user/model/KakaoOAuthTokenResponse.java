package com.readwe.gimisangung.user.model;

import lombok.Getter;

@Getter
public class KakaoOAuthTokenResponse {


	private final String tokenType;

	private final String accessToken;

	private final String idToken;

	private final Integer expiresIn;

	private final String refreshToken;

	private final Integer refreshTokenExpiresIn;

	private final String scope;

	public KakaoOAuthTokenResponse(String token_type, String access_token, String id_token, Integer expires_in,
		String refresh_token, Integer refresh_token_expires_in, String scope) {
		this.tokenType = token_type;
		this.accessToken = access_token;
		this.idToken = id_token;
		this.expiresIn = expires_in;
		this.refreshToken = refresh_token;
		this.refreshTokenExpiresIn = refresh_token_expires_in;
		this.scope = scope;
	}
}
