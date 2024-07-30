package com.readwe.gimisangung.contract.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.readwe.gimisangung.contract.model.dto.AnalyzeResultDto;
import com.readwe.gimisangung.contract.model.dto.CreateContractRequestVo;
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

	@PostMapping("")
	public ResponseEntity<?> createContract(@SessionAttribute(name = "user") User user, @RequestBody CreateContractRequestVo createContractRequestVo) {
		AnalyzeResultDto analyzeResultDto = contractService.analyzeContract(createContractRequestVo.getFiles());

		return ResponseEntity.status(HttpStatus.CREATED).body(analyzeResultDto);
	}
}
