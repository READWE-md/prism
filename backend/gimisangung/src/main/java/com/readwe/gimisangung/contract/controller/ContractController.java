package com.readwe.gimisangung.contract.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;
import com.readwe.gimisangung.contract.model.service.ContractService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/contracts")
public class ContractController {

	private final ContractService contractService;

	@PostMapping("")
	public ResponseEntity<?> createContract(MultipartFile file) {
		AnalyzeResultDto analyzeResultDto = contractService.analyzeContract(file);

		return ResponseEntity.status(HttpStatus.CREATED).body(analyzeResultDto);
	}
}
