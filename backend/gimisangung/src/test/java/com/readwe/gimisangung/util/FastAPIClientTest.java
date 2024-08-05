// package com.readwe.gimisangung.util;
//
// import java.io.IOException;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.util.ArrayList;
// import java.util.List;
// import java.util.zip.ZipInputStream;
//
// import org.json.JSONArray;
// import org.json.JSONException;
// import org.json.JSONObject;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
//
// class FastAPIClientTest {
//
// 	@Test
// 	@DisplayName("FastAPI 요청 클라이언트 테스트")
// 	void testReqeust() {
// 		//
// 		// String jsonFilePath = "C:\\Users\\SSAFY\\Downloads\\fastapi-test.json"; // 이 경로를 실제 JSON 파일 경로로 변경하세요
// 		//
// 		// try {
// 		// 	// JSON 파일을 문자열로 읽기
// 		// 	Path path = Paths.get(jsonFilePath);
// 		// 	String content = new String(Files.readAllBytes(path));
// 		//
// 		// 	// JSON 객체 생성
// 		// 	JSONObject jsonObject = new JSONObject(content);
// 		//
// 		// 	// "images" 배열에서 "encodedImage" 값 가져오기
// 		// 	JSONArray imagesArray = jsonObject.getJSONArray("images");
// 		// 	String encodedImage = imagesArray.getString(0); // 첫 번째 요소 가져오기
// 		//
// 		// 	FastAPIClient client = new FastAPIClient();
// 		// 	client.setContractId(0L);
// 		// 	List<String> images = new ArrayList<>();
// 		// 	images.add(encodedImage);
// 		// 	client.setImages(images);
// 		//
// 		// 	System.out.println(client.sendRequest());
// 		// } catch (IOException | JSONException e) {
// 		// 	e.printStackTrace();
// 		// }
//
//
// 	}
//
// }