package com.readwe.gimisangung.directory.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateDirectoryRequestDto {

	@NotNull
	private Long parentId;

	@NotBlank
	@Size(max = 64)
	private String name;
}
