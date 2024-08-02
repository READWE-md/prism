package com.readwe.gimisangung.directory.model.dto;

import java.util.List;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.directory.model.entity.Directory;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GetDirectoriesAndContractsInDirectoryDto {
	private List<DirectoryDto> directories;
	private List<Contract> contracts;
}
