package com.readwe.gimisangung.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;

import com.readwe.gimisangung.contract.model.entity.ImageDto;
import com.readwe.gimisangung.directory.exception.DirectoryErrorCode;
import com.readwe.gimisangung.directory.exception.FileErrorCode;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileUtil {

	public static final String rootPath = System.getProperty("user.dir");

	public static File createFolder(Long userId, Long contractId) {
		String path = Paths.get(rootPath, "backend", "gimisangung", "src",
			"main", "resources", "images", userId.toString(), contractId.toString()).toString();
		File userDirectory = new File(path);

		if (!userDirectory.mkdirs()) {
			throw new CustomException(FileErrorCode.FOLDER_EXISTS);
		}

		return userDirectory;
	}

	public static void saveImages(String folderPath, List<String> images) {
		for (int i = 0; i < images.size(); i++) {
			byte[] imageBytes = null;
			try {
				String[] image = images.get(i).split(",");
				String type = image[0];
				if (!type.startsWith("data:image")) {
					throw new CustomException(GlobalErrorCode.ILLEGAL_ARGUMENT);
				}
				String data = image[1];
				imageBytes = Base64.getDecoder().decode(data);
			} catch (IllegalArgumentException | CustomException e) {
				throw new CustomException(GlobalErrorCode.ILLEGAL_ARGUMENT);
			} catch (Exception e) {
				throw new CustomException(GlobalErrorCode.BAD_REQUEST);
			}
			String filePath = folderPath + "/" + (i + 1) + ".png";

			try (OutputStream os = new FileOutputStream(filePath)) {
				os.write(imageBytes);
			} catch (Exception e) {
				log.error("failed saving images", e);
				throw new CustomException(FileErrorCode.SAVE_FILE_FAILED);
			}
		}
	}

	public static void deleteFile(String path) {
		File file = new File(path);
		try {
			if (file.exists()) {
				if (file.delete()) {
					log.info("delete file success");
				} else {
					log.info("delete file failed");
				}
			}
		} catch (Exception e) {
			log.error("failed deleting file", e);
		}
	}

	/*
	path에 있는 폴더와 그 내부에 있는 모든 파일과 폴더를 삭제한다.
	 */
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
			log.error("failed deleting directory", e);
		}
	}

	/*
	파일을 사전 순서대로 정렬하여 리스트 형태로 리턴한다.
	 */
	public static List<File> getFiles(String path) {
		File folder = new File(path);
		File[] folder_list = null;
		try {
			if (folder.exists()) {
				folder_list = folder.listFiles(); //파일리스트 얻어오기
			}
			if (!folder.exists() || folder_list == null){
				log.info("there is no file at path");
				throw new CustomException(DirectoryErrorCode.DIRECTORY_NOT_FOUND);
			}
		} catch (Exception e) {
			log.error("failed getting files", e);
			throw new CustomException(FileErrorCode.GET_FILE_FAILED);
		}

		return Arrays.stream(folder_list).sorted(Comparator.comparing(File::getAbsolutePath)).toList();
	}

	public static List<ImageDto> convertToImage(List<File> files) {
		List<ImageDto> imageDtos = new ArrayList<>();
		for (int i = 0; i < files.size(); i++) {
			File file = files.get(i);
			if (file.isDirectory()) continue;
			if (file.exists() && file.canRead()) {
				try {
					byte[] fileBytes = Files.readAllBytes(Path.of(file.getPath()));
					String base64 = Base64.getEncoder().encodeToString(fileBytes);
					String fileName = file.getName();
					String fileNameWithoutExtension = fileName.substring(0, fileName.indexOf("."));

					ImageDto imageDto = ImageDto.builder()
						.page(Integer.parseInt(fileNameWithoutExtension))
						.base64(base64)
						.build();
					imageDtos.add(imageDto);
				} catch (Exception e) {
					log.error("failed converting image", e);
					throw new CustomException(FileErrorCode.CONVERT_IMAGE_FAILED);
				}
			} else {
				log.error("failed getting files");
				throw new CustomException(FileErrorCode.GET_FILE_FAILED);
			}
		}

		return imageDtos;
	}

}
