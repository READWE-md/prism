package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import com.readwe.gimisangung.contract.model.entity.Contract;

public interface ContractCustomRepository {
	List<Contract> findAllByUserIdAndTagName(Long userId, String tagName);

	List<Contract> findAllByUserIdAndName(Long userId, String name);
}
