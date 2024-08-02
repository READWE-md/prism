package com.readwe.gimisangung.directory.model.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DirectoryDto {

	private Long id;

	private String title;

	private Date createdAt;
}
