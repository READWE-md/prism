package com.readwe.gimisangung.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class FileUtilTest {

	@Test
	@DisplayName("디렉토리를 생성할 수 있다.")
	void createDirectory() {

	}

	@Test
	@DisplayName("디렉토리에 Base64형태의 이미지 파일을 저장할 수 있다.")
	void saveImages() {

	}

	@Test
	@DisplayName("파일을 삭제할 수 있다.")
	void deleteFile() {
		FileUtil.deleteDirectory("resources/static/images/testImage.jpeg");
	}

	@Test
	@DisplayName("디렉토리와 내부 파일들을 삭제할 수 있다.")
	void deleteDirectory() {

	}

}
