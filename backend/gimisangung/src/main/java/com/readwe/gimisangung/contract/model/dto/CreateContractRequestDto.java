package com.readwe.gimisangung.contract.model.dto;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.readwe.gimisangung.contract.model.entity.Tag;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateContractRequestDto {
	private String name;
	private Long parentId;
	private List<String> images;
}
