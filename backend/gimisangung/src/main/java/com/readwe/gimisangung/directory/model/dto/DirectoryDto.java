package com.readwe.gimisangung.directory.model.dto;

import java.util.Date;

import com.readwe.gimisangung.directory.model.entity.Directory;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DirectoryDto {

	private Long id;

	private String name;

	private Date createdAt;

	public static DirectoryDto of(Directory directory) {
		return new DirectoryDto(directory.getId(), directory.getName(), directory.getCreatedAt());
	}
}
