package com.readwe.gimisangung.contract.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.readwe.gimisangung.contract.model.dto.AnalyzeContractResultDto;
import com.readwe.gimisangung.contract.model.dto.AnalyzeContractRequestDto;
import com.readwe.gimisangung.contract.model.dto.ContractDetailResponseDto;
import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.service.ContractService;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/contracts")
public class ContractController {

	private final ContractService contractService;
	private final UserService userService;

	@GetMapping("/{id}")
	public ResponseEntity<?> getContractDetail(@SessionAttribute(name = "user") User user,
		@RequestParam(name = "id") Long id) {
		ContractDetailResponseDto contractDetailResponseDto = contractService.getContractDetail(user, id);

		return ResponseEntity.status(HttpStatus.OK).body(contractDetailResponseDto);
	}

	@PostMapping("")
	public ResponseEntity<?> createContract(@SessionAttribute(name = "user") User user, @RequestBody
	CreateContractRequestDto createContractRequestDto) {
		contractService.createContract(user, createContractRequestDto);

		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PostMapping("/analyze")
	public ResponseEntity<?> analyzeContract(@SessionAttribute(name = "user") User user,
		@RequestBody AnalyzeContractRequestDto analyzeContractRequestDto) {
		AnalyzeContractResultDto analyzeContractResultDto = contractService.analyzeContract(
			analyzeContractRequestDto.getFiles());

		return ResponseEntity.status(HttpStatus.CREATED).body(analyzeContractResultDto);
	}
}
