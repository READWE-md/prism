package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import com.readwe.gimisangung.contract.model.dto.ContractDto;

public interface ContractCustomRepository {

	List<ContractDto> findAllByUserIdAndName(Long userId, String keyword);
	List<ContractDto> findAllByUserIdAndTagName(Long userId, String tagName);
	void deleteAllByParentId(Long parentId);
}