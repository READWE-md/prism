package com.readwe.gimisangung.contract.model.service;

import java.util.List;

import com.readwe.gimisangung.contract.model.dto.AnalyzeContractResultDto;
import com.readwe.gimisangung.contract.model.dto.ContractDetailResponseDto;
import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.dto.FindContractResultDto;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.user.model.User;

public interface ContractService {
	ContractDetailResponseDto getContractDetail(User user, Long id);

	Contract createContract(User user, CreateContractRequestDto createContractRequestDto);

	List<Contract> getContractsByParentId(Long id, User user);

	List<FindContractResultDto> findContract(User user, List<String> tags, String name);
}