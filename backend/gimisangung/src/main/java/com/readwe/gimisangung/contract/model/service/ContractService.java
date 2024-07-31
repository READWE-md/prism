package com.readwe.gimisangung.contract.model.service;

import java.util.List;

import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;
import com.readwe.gimisangung.contract.model.dto.AnalyzeContractResultDto;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.user.model.User;

public interface ContractService {

	public AnalyzeContractResultDto analyzeContract(List<String> encodedImages);

	List<Contract> getContractsByParentId(Long id, User user);
}
