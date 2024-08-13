package com.readwe.gimisangung.directory.model.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetDirectoryResponseDto {
	private Long id;
	private String name;
	@JsonFormat(timezone = "Asia/Seoul")
	private LocalDateTime createdAt;
	private Long parentId;
}
