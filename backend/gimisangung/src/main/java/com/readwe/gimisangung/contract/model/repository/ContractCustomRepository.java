package com.readwe.gimisangung.contract.model.repository;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.contract.model.dto.ContractDto;

@Repository
public interface ContractCustomRepository {
	List<ContractDto> findAllByParentId(Long id);
	// List<ContractDto> findAllByUserIdAndKeyword(Long id, String keyword);
	List<ContractDto> findByUserIdAndParams(Long id, Map<String, Object> params);
	void deleteAllByParentId(Long parentId);
}