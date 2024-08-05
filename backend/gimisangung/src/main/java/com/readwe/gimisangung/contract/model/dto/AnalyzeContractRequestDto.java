package com.readwe.gimisangung.contract.model.dto;

import java.util.List;

import com.readwe.gimisangung.contract.model.entity.Tag;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeContractRequestDto {
	private String title;
	private String savePath;
	private List<String> files;
	private List<String> tags;
}
