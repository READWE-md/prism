package com.readwe.gimisangung.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Base64;
import java.util.List;

import com.readwe.gimisangung.directory.exception.DirectoryErrorCode;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileUtil {

	public static final String rootPath = System.getProperty("user.dir");

	public static File createDirectory(Long userId, Long parentId, String contractName) {
		File userDirectory = new File(rootPath + "/backend/gimisangung/src/main/resources/static/images/" + userId
			+ "/" + parentId + "/" + contractName + "/");

		if (!userDirectory.mkdirs()) {
			throw new CustomException(DirectoryErrorCode.DIRECTORY_EXISTS_INTERNALLY);
		}

		return userDirectory;
	}

	public static void saveImages(String folderPath, List<String> images) {
		for (int i = 0; i < images.size(); i++) {
			String image = images.get(i);
			byte[] imageBytes = null;
			try {
				imageBytes = Base64.getDecoder().decode(image);
			} catch (IllegalArgumentException e) {
				log.error("illigal argument", e);
				throw new CustomException(GlobalErrorCode.ILLEGAL_ARGUMENT);
			}
			String filePath = folderPath + "/" + i + ".png";

			try (OutputStream os = new FileOutputStream(filePath)) {
				os.write(imageBytes);
			} catch (Exception e) {
				log.error("failed saving images", e);
				throw new CustomException(DirectoryErrorCode.SAVE_FILE_FAILED);
			}
		}
	}

	public static void deleteFile(String path) {
		File file = new File(path);
		if (file.exists()) {
			if (file.delete()) {
				System.out.println("success");
				log.info("delete file success");
			} else {
				log.info("delete file failed");
			}
		}
	}

	public static void deleteDirectory(String path) {
		File folder = new File(path);
		try {
			if(folder.exists()){
				File[] folder_list = folder.listFiles(); //파일리스트 얻어오기

				for (int i = 0; i < folder_list.length; i++) {
					if(folder_list[i].isFile()) {
						folder_list[i].delete();
					}else {
						deleteDirectory(folder_list[i].getPath()); //재귀함수호출
					}
					folder_list[i].delete();
				}
				folder.delete(); //폴더 삭제
			}
		} catch (Exception e) {
			e.getStackTrace();
		}
	}

}
