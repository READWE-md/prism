package com.readwe.gimisangung.user.model;

import org.springframework.beans.factory.annotation.Value;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class KakaoOAuthTokenRequstBody {

	private final String grant_type = "authorization_code";

	private String client_id;

	private String redirect_uri;

	private String client_secret;

	private String code;


}
