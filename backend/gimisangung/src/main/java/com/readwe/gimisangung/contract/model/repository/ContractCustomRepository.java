package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import com.readwe.gimisangung.contract.model.entity.Contract;

public interface ContractCustomRepository {

	List<Contract> findAllByUserIdAndName(Long userId, String name);
}