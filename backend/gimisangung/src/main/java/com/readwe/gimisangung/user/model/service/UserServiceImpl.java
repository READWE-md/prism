package com.readwe.gimisangung.user.model.service;

import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.service.DirectoryService;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;
import com.readwe.gimisangung.user.model.KakaoOAuthProperties;
import com.readwe.gimisangung.user.model.KakaoUserInfo;
import com.readwe.gimisangung.user.model.KakaoOAuthTokenResponse;
import com.readwe.gimisangung.user.model.User;

import com.readwe.gimisangung.user.model.dto.UserDto;
import com.readwe.gimisangung.user.model.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private static final String KAKAO_OAUTH_TOKEN_URL = "https://kauth.kakao.com/oauth/token";

	private final KakaoOAuthProperties kakaoOAuthProperties;

	private final UserRepository userRepository;
	private final DirectoryService directoryService;

	@Override
	public UserDto login(String code) {

		try {
			KakaoOAuthTokenResponse tokenResponse = requestToken(code);
			KakaoUserInfo userInfo = getUserInfo(tokenResponse.getAccessToken());

			User savedUser = null;

			if (!userRepository.existsByOauthId(userInfo.getId())) {
				User user = userRepository.save(User.builder()
					.oauthId(userInfo.getId())
					.accessToken(tokenResponse.getAccessToken())
					.expiresIn(tokenResponse.getExpiresIn())
					.refreshToken(tokenResponse.getRefreshToken())
					.refreshExpiresIn(tokenResponse.getRefreshTokenExpiresIn())
					.build());

				Directory rootDirectory = directoryService.createRootDirectory(user);

				user.setRootDirectoryId(rootDirectory.getId());

				savedUser = userRepository.save(user);
			} else {
				savedUser = userRepository.findByOauthId(userInfo.getId());
			}

			return UserDto.builder()
				.id(savedUser.getId())
				.oauthId(savedUser.getOauthId())
				.username(userInfo.getNickname())
				.profileImageUrl(userInfo.getProfileImageUrl())
				.accessToken(savedUser.getAccessToken())
				.expiresIn(savedUser.getExpiresIn())
				.refreshToken(savedUser.getRefreshToken())
				.refreshExpiresIn(savedUser.getRefreshExpiresIn())
				.rootDirectoryId(savedUser.getRootDirectoryId())
				.build();
		} catch (JsonProcessingException e) {
			throw new CustomException(GlobalErrorCode.BAD_REQUEST);
		}
	}

	private KakaoOAuthTokenResponse requestToken(String code) throws JsonProcessingException {
		// 요청 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", kakaoOAuthProperties.getClientId());
		params.add("redirect_uri", kakaoOAuthProperties.getRedirectURI());
		params.add("code", code);
		params.add("client_secret", kakaoOAuthProperties.getClientSecret());

		// 요청 본문 설정
		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<KakaoOAuthTokenResponse> response = restTemplate.exchange(KAKAO_OAUTH_TOKEN_URL, HttpMethod.POST, entity, KakaoOAuthTokenResponse.class);

		return response.getBody();
	}

	public KakaoUserInfo getUserInfo(String accessToken) throws JsonProcessingException {

		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(accessToken);
		headers.setContentType(new MediaType("application", "x-www-form-urlencoded", StandardCharsets.UTF_8));

		HttpEntity<String> entity = new HttpEntity<>(headers);
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.postForEntity("https://kapi.kakao.com/v2/user/me", entity, String.class);

		String responseBody = response.getBody();
		ObjectMapper objectMapper = new ObjectMapper();

		JsonNode jsonNode = objectMapper.readTree(responseBody);
		Long id = jsonNode.get("id").asLong();
		String name = jsonNode.get("kakao_account").get("profile").get("nickname").asText();
		String profileImageUrl = jsonNode.get("kakao_account").get("profile").get("profile_image_url").asText();

		return new KakaoUserInfo(id, name, profileImageUrl);
	}
}
