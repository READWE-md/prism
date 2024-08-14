package com.readwe.gimisangung.contract.model.service;

import java.time.LocalDateTime;
import java.util.List;

import com.readwe.gimisangung.contract.model.dto.ContractDetailResponseDto;
import com.readwe.gimisangung.contract.model.dto.ContractDto;
import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.dto.FindContractResponseDto;
import com.readwe.gimisangung.contract.model.dto.UpdateContractRequestDto;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.user.model.User;

public interface ContractService {
	ContractDetailResponseDto getContractDetail(User user, Long id);

	Contract createContract(User user, CreateContractRequestDto createContractRequestDto);

	List<ContractDto> getContractsByParentId(Long id, User user);

	FindContractResponseDto findContracts(User user, String keyword, LocalDateTime startDate, LocalDateTime endDate);

	void updateContract(User user, Long id, UpdateContractRequestDto updateContractRequestDto);

	void deleteContract(User user, Long id);

	void deleteContracts(List<Contract> contracts);

	void updateViewedAt(Long id);
}