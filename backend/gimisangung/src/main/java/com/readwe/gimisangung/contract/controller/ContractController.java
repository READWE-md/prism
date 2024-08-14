package com.readwe.gimisangung.contract.controller;

import java.time.LocalDateTime;

import com.readwe.gimisangung.contract.model.dto.FindContractResponseDto;
import com.readwe.gimisangung.contract.model.dto.UpdateContractRequestDto;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;
import com.readwe.gimisangung.user.exception.UserErrorCode;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.readwe.gimisangung.contract.model.dto.ContractDetailResponseDto;
import com.readwe.gimisangung.contract.model.dto.CreateContractRequestDto;
import com.readwe.gimisangung.contract.model.service.ContractService;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.user.model.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/contracts")
@Tag(name = "Contract", description = "계약서 API")
public class ContractController {

	private final ContractService contractService;
	private final UserService userService;

	@GetMapping("")
	@Operation(summary = "계약서 검색 결과 조회", description = "키워드, 시간 범위로 검색한 결과를 조회합니다.")
	@ApiResponse(responseCode = "200", description = "성공")
	@ApiResponse(responseCode = "400", description = "잘못된 요청입니다.")
	@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다.")
	public ResponseEntity<?> findContracts (
		@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user,
		@Parameter(description = "키워드 - 이름과 태그 둘 다 검색")
		@RequestParam(name = "keyword", required = false) String keyword,
		@Parameter(description = "날짜 - 시작일")
		@DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
		@RequestParam(name = "startDate", required = false) LocalDateTime startDate,
		@Parameter(description = "날짜 - 종료일")
		@DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
		@RequestParam(name = "endDate", required = false) LocalDateTime endDate
		) {
		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		log.info("startDate: {}, endDate: {}", startDate, endDate);

		FindContractResponseDto findContractResult = contractService.findContracts(user, keyword, startDate, endDate);

		return ResponseEntity.status(HttpStatus.OK).body(findContractResult);
	}

	@GetMapping("/{id}")
	@Operation(summary = "계약서 상세 조회", description = "태그와 이름으로 검색한 결과를 조회합니다.")
	@ApiResponse(responseCode = "200", description = "성공")
	@ApiResponse(responseCode = "400", description = "잘못된 요청입니다.")
	@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다.")
	@ApiResponse(responseCode = "403", description = "권한이 없는 사용자입니다.")
	@ApiResponse(responseCode = "404", description = "존재하지 않는 계약서입니다.")
	@ApiResponse(responseCode = "500", description = "파일 가져오기를 실패했습니다.")
	@ApiResponse(responseCode = "503", description = "아직 분석되지 않은 계약서입니다.")
	public ResponseEntity<?> getContractDetail(
		@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user,
		@Parameter(description = "계약서 id")
		@PathVariable(name = "id") Long id) {
		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		if (id == null) {
			throw new CustomException(GlobalErrorCode.BAD_REQUEST);
		}

		contractService.updateViewedAt(id);
		ContractDetailResponseDto contractDetailResponseDto = contractService.getContractDetail(user, id);

		return ResponseEntity.status(HttpStatus.OK).body(contractDetailResponseDto);
	}

	@PostMapping("")
	@Operation(summary = "계약서 생성", description = "계약서를 생성합니다.")
	@ApiResponse(responseCode = "201", description = "생성됨")
	@ApiResponse(responseCode = "400", description = "잘못된 요청입니다.")
	@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다.")
	@ApiResponse(responseCode = "403", description = "권한이 없는 사용자입니다.")
	@ApiResponse(responseCode = "404", description = "존재하지 않는 디렉토리입니다.")
	@ApiResponse(responseCode = "409", description = "이미 존재하는 계약서입니다.")
	@ApiResponse(responseCode = "500", description = "파일 가져오기를 실패했습니다.")
	@ApiResponse(responseCode = "503", description = "아직 분석되지 않은 계약서입니다.")
	public ResponseEntity<?> createContract(
		@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user,
		@Parameter(description = "계약서 생성시 필요한 정보 - 이름, 상위 디렉토리 id, 태그, 이미지")
		@RequestBody CreateContractRequestDto createContractRequestDto) {
		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		contractService.createContract(user, createContractRequestDto);

		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PutMapping("/{id}")
	@Operation(summary = "계약서 수정", description = "계약서를 수정합니다.")
	@ApiResponse(responseCode = "200", description = "성공")
	@ApiResponse(responseCode = "400", description = "잘못된 요청입니다.")
	@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다.")
	@ApiResponse(responseCode = "403", description = "권한이 없는 사용자입니다.")
	@ApiResponse(responseCode = "404", description = "존재하지 않는 디렉토리입니다.")
	@ApiResponse(responseCode = "409", description = "이미 존재하는 계약서입니다.")
	public ResponseEntity<?> updateContract(
		@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user,
		@Parameter(description = "계약서 수정시 필요한 정보 - 이름, 상위 디렉토리 id, 태그")
		@RequestBody UpdateContractRequestDto updateContractRequestDto,
		@Parameter(description = "계약서 id")
		@PathVariable(name = "id") Long id) {
		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		if (id == null) {
			throw new CustomException(GlobalErrorCode.BAD_REQUEST);
		}

		contractService.updateContract(user, id, updateContractRequestDto);

		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "계약서 삭제", description = "계약서를 삭제합니다.")
	@ApiResponse(responseCode = "200", description = "성공")
	@ApiResponse(responseCode = "400", description = "잘못된 요청입니다.")
	@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다.")
	@ApiResponse(responseCode = "403", description = "권한이 없는 사용자입니다.")
	@ApiResponse(responseCode = "404", description = "존재하지 않는 계약서입니다.")
	public ResponseEntity<?> deleteContract(
		@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user,
		@Parameter(description = "계약서 id")
		@PathVariable(name = "id") Long id) {
		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		if (id == null) {
			throw new CustomException(GlobalErrorCode.BAD_REQUEST);
		}

		contractService.deleteContract(user, id);

		return ResponseEntity.status(HttpStatus.OK).build();
	}

}