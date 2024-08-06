package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import com.readwe.gimisangung.contract.model.dto.ContractDto;

public interface ContractCustomRepository {

	List<ContractDto> findAllByUserIdAndKeyword(Long id, String keyword);
	void deleteAllByParentId(Long parentId);
}