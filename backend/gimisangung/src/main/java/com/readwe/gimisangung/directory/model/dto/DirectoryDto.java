package com.readwe.gimisangung.directory.model.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.readwe.gimisangung.directory.model.entity.Directory;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DirectoryDto {

	private Long id;

	private String name;

	@JsonFormat(timezone = "Asia/Seoul")
	private LocalDateTime createdAt;

	public static DirectoryDto of(Directory directory) {
		return new DirectoryDto(directory.getId(), directory.getName(), directory.getCreatedAt());
	}
}
