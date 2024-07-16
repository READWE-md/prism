package com.readwe.gimisangung.util;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HashUtil {
	private HashUtil(){}

	public static String getDigest(String plainText){

		MessageDigest messageDigest = null;

		try {
			messageDigest = MessageDigest.getInstance("SHA-512");
			messageDigest.reset();
			messageDigest.update(plainText.getBytes("UTF-8"));
		} catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
			log.error(e.getMessage());
		}

		return String.format("%0128x", new BigInteger(1, messageDigest.digest()));

	public static String computeSHA512(String input) throws RuntimeException {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-512");
			byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
			return bytesToHex(hash);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("No such algorithm available for SHA512", e);
		}
	}

	public static String bytesToHex(byte[] bytes) {
		StringBuilder sb = new StringBuilder();
		for (byte b : bytes) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();
	}

	public static String generateSalt() throws RuntimeException {
		try {
			// SecureRandom 인스턴스 생성
			SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");

			// salt 길이 (바이트 단위)
			byte[] salt = new byte[16];

			// 무작위 salt 값 생성
			sr.nextBytes(salt);

			// 생성된 salt 값을 Base64로 인코딩하여 문자열로 변환
			return Base64.getEncoder().encodeToString(salt);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("No such algorithm available for SecureRandom", e);
		}
	}
}
