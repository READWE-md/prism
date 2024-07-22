package com.readwe.gimisangung.contract.model.service;

import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;

public interface ContractService {
	public AnalyzeResultDto analyzeContract(String encodedImage);
}
