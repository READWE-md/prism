package com.readwe.gimisangung.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserDto {

	private Long id;

	private Long oauthId;

	private String username;

	private String profileImageUrl;

	private String accessToken;

	private Integer expiresIn;

	private String refreshToken;

	private Integer refreshExpiresIn;

	private Long rootDirectoryId;
}
