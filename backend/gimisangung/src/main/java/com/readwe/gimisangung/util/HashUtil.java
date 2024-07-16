package com.readwe.gimisangung.util;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

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
	}
}
