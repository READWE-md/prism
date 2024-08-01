package com.readwe.gimisangung.contract.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.contract.model.entity.Contract;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

	void deleteAllByParentId(Long parentId);
}