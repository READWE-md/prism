package com.readwe.gimisangung.user.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class KakaoUserInfo {
	private Long id;
	private String nickname;
	private String profileImageUrl;
}
