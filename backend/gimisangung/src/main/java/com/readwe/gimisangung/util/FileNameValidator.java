package com.readwe.gimisangung.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FileNameValidator {

	private static final String REGEX = "^[a-zA-z가-힣0-9_\\-\\s]+$";

	private FileNameValidator() {}

	public static boolean isValidFileName(String fileName) {
		Pattern pattern = Pattern.compile(REGEX);
		Matcher matcher = pattern.matcher(fileName);
		return matcher.matches();
	}
}
