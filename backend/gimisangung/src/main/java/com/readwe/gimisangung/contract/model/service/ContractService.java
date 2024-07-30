package com.readwe.gimisangung.contract.model.service;

import java.util.List;

import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;
import com.readwe.gimisangung.contract.model.entity.Contract;

public interface ContractService {

	public AnalyzeResultDto analyzeContract(List<String> encodedImages);

	List<Contract> getContractsByParentId();
}
