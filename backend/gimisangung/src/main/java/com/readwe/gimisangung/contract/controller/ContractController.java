package com.readwe.gimisangung.contract.controller;

import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import com.readwe.gimisangung.contract.model.dto.FindContractResultDto;
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

	@GetMapping("")
	public ResponseEntity<?> findContract(@SessionAttribute(name = "user") User user,
		@RequestParam(name = "tag", required = false) List<String> tags,
		@RequestParam(name = "name", required = false) String name) {
		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		List<FindContractResultDto> findContractResult = contractService.findContract(user, tags, name);

		return ResponseEntity.status(HttpStatus.OK).body(findContractResult);
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getContractDetail(@SessionAttribute(name = "user") User user,
		@PathVariable(name = "id") Long id) {
		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		ContractDetailResponseDto contractDetailResponseDto = contractService.getContractDetail(user, id);

		return ResponseEntity.status(HttpStatus.OK).body(contractDetailResponseDto);
	}

	@PostMapping("")
	public ResponseEntity<?> createContract(@SessionAttribute(name = "user") User user, @RequestBody
	CreateContractRequestDto createContractRequestDto) {
		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		contractService.createContract(user, createContractRequestDto);

		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
}