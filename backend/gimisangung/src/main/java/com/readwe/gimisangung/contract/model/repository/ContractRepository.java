package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.contract.model.entity.Contract;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long>, ContractCustomRepository {

	boolean existsByParentIdAndName(Long id, String name);

	List<Contract> findAllByUserId(Long id);

	List<Contract> findAllByParentIdOrderById(Long id);
}