package com.readwe.gimisangung.directory.model.dto;

import java.util.List;

import com.readwe.gimisangung.contract.model.dto.ContractDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GetDirectoriesAndContractsInDirectoryResponseDto {
	private List<DirectoryDto> directories;
	private List<ContractDto> contracts;
}
