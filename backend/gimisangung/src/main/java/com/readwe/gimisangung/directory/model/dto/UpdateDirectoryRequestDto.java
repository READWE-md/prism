package com.readwe.gimisangung.directory.model.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class UpdateDirectoryRequestDto {

	private String name;
	private Long parentId;
}
