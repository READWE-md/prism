package com.readwe.gimisangung.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OAuthLoginResponseDto {

	private Long id;

	private Long rootDirectoryId;

	private String username;

	private String profileImageUrl;

}
