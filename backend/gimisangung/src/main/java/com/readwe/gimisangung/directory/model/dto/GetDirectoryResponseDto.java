package com.readwe.gimisangung.directory.model.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetDirectoryResponseDto {
	private Long id;
	private String name;
	private Date createdAt;
	private Long parentId;
}
