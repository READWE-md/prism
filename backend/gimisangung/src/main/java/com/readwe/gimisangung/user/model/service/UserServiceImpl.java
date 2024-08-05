package com.readwe.gimisangung.user.model.service;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.service.DirectoryService;
import com.readwe.gimisangung.user.model.KakaoUserInfo;
import com.readwe.gimisangung.user.model.KakaoOAuthTokenResponse;
import com.readwe.gimisangung.user.model.KakaoOAuthTokenRequstBody;
import com.readwe.gimisangung.user.model.User;

import com.readwe.gimisangung.user.model.dto.OAuthLoginResponseDto;
import com.readwe.gimisangung.user.model.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	@Value("${oauth.kakao.token_request_url}")
	private static String KAKAO_OAUTH_TOKEN_URL;

	private final UserRepository userRepository;
	private final DirectoryService directoryService;

	// @Override
	// public User login(LoginRequestDto loginRequestDto) throws RuntimeException {
	// 	// repository 조회
	// 	User user = userRepository.findUserByEmail(loginRequestDto.getEmail());
	//
	// 	// 해당하는 사용자가 없는 경우 null 반환
	// 	if (user == null) {
	// 		throw new CustomException(UserErrorCode.USER_NOT_FOUND);
	// 	}
	//
	// 	// 입력받은 암호에 salt 값을 뒤에 붙여줌
	// 	String saltedPassword = loginRequestDto.getPassword() + user.getSalt();
	//
	// 	// entity의 digest 값과 같은지 확인
	// 	if (!HashUtil.getDigest(saltedPassword).equals(user.getPassword())) {
	// 		throw new CustomException(UserErrorCode.BAD_REQUEST);
	// 	}
	//
	// 	return user;
    // }
    //
    // @Override
	// @Transactional
    // public User signup(SignupRequestDto signupRequestDto) throws RuntimeException {
	//
	// 	if (userRepository.existsByEmail(signupRequestDto.getEmail())) {
	// 		throw new CustomException(UserErrorCode.USER_EXISTS);
	// 	}
	//
	// 	String salt = HashUtil.generateSalt();
	// 	String password = HashUtil.getDigest(signupRequestDto.getPassword() + salt);
	//
	// 	User user = userRepository.save(User.builder()
	// 		.username(signupRequestDto.getUsername())
	// 		.email(signupRequestDto.getEmail())
	// 		.password(password)
	// 		.salt(salt)
	// 		.build());
	//
	// 	Directory rootDir = directoryService.createRootDirectory(user);
	//
	// 	user.setRootDirId(rootDir.getId());
	//
	// 	return user;
	// }

	@Override
	public OAuthLoginResponseDto login(String code) {

		KakaoOAuthTokenResponse tokenResponse = requestToken(code);

		try {
			KakaoUserInfo userInfo = getUserInfo(tokenResponse.getAccessToken());

			User user = userRepository.save(User.builder()
				.oauthId(userInfo.getId())
				.accessToken(tokenResponse.getAccessToken())
				.expiresIn(tokenResponse.getExpiresIn())
				.refreshToken(tokenResponse.getRefreshToken())
				.refreshExpiresIn(tokenResponse.getRefreshTokenExpiresIn())
				.build());

			Directory rootDirectory = directoryService.createRootDirectory(user);

			user.setRootDirectoryId(rootDirectory.getId());

			userRepository.save(user);

			return new OAuthLoginResponseDto(user.getId(), user.getRootDirectoryId(),
				userInfo.getNickname(), userInfo.getProfileImageUrl());
		} catch (JsonProcessingException e) {
			throw new RuntimeException(e);
		}
	}

	private KakaoOAuthTokenResponse requestToken(String code) {
		// 요청 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(new MediaType("application", "x-www-form-urlencoded", StandardCharsets.UTF_8));

		// 요청 파라미터 설정
		KakaoOAuthTokenRequstBody requstBody = new KakaoOAuthTokenRequstBody(code);

		// 요청 본문 설정
		HttpEntity<KakaoOAuthTokenRequstBody> entity = new HttpEntity<>(requstBody, headers);

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
		String name = jsonNode.get("properties").get("kakao_account.profile").get("nickname").asText();
		String profileImageUrl = jsonNode.get("properties").get("kakao_account.profile").get("profile_image_url").asText();

		return new KakaoUserInfo(id, name, profileImageUrl);
	}
}
