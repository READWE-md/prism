package com.readwe.gimisangung.directory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.readwe.gimisangung.contract.model.dto.ContractDto;
import com.readwe.gimisangung.contract.model.service.ContractService;
import com.readwe.gimisangung.directory.model.dto.DirectoryDto;
import com.readwe.gimisangung.directory.model.dto.GetDirectoryResponseDto;
import com.readwe.gimisangung.directory.model.dto.UpdateDirectoryRequestDto;
import com.readwe.gimisangung.directory.model.dto.GetDirectoriesAndContractsInDirectoryResponseDto;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.dto.CreateDirectoryRequestDto;
import com.readwe.gimisangung.directory.model.service.DirectoryService;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.exception.GlobalErrorCode;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;
import com.readwe.gimisangung.util.FileNameValidator;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "Directory Management", description = "Directory API")
@RequestMapping("/api/v1/directories")
public class DirectoryController {

	private final DirectoryService directoryService;
	private final ContractService contractService;

	@PostMapping
	@Operation(summary = "디렉토리 생성 API", description = "로그인한 사용자 소유의 디렉토리를 생성하는 API입니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "디렉토리 생성 성공"),
		@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다."),
		@ApiResponse(responseCode = "403", description = "권한이 없는 사용자입니다."),
		@ApiResponse(responseCode = "409", description = "이미 존재하는 디렉토리명입니다.")
	})
	public ResponseEntity<?> createDirectory(@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user, @RequestBody
		@Validated CreateDirectoryRequestDto createDirectoryRequestDto) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		directoryService.createDirectory(createDirectoryRequestDto, user);

		return ResponseEntity.status(HttpStatus.CREATED).contentType(MediaType.APPLICATION_JSON).build();
	}

	@GetMapping("{id}")
	@Operation(summary = "디렉토리 정보 조회 API", description = "디렉토리의 정보를 조회하는 API입니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200"),
		@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다."),
		@ApiResponse(responseCode = "403", description = "권한이 없는 사용자입니다."),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 디렉토리입니다.")
	})
	public ResponseEntity<?> getDirectory(@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user, @PathVariable("id") Long id) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		Directory directory = directoryService.getDirectory(id, user);

		GetDirectoryResponseDto directoryResponseDto = new GetDirectoryResponseDto(directory.getId(), directory.getName(), directory.getCreatedAt(), directory.getParent() == null ? null : directory.getParent().getId());

		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(directoryResponseDto);
	}

	@GetMapping("{id}/files")
	@Operation(summary = "디렉토리 내의 모든 파일 조회 API", description = "디렉토리 내의 디렉토리와, 계약서들을 조회하여 반환하는 API입니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200"),
		@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다."),
		@ApiResponse(responseCode = "404", description = "디렉토리가 존재하지 않습니다.")
	})
	public ResponseEntity<?> getDirectoriesAndContractsInDirectory(@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user, @PathVariable("id") Long id) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		List<DirectoryDto> directories = directoryService.getDirectoriesByParentId(id, user);
		List<ContractDto> contracts = contractService.getContractsByParentId(id, user);

		GetDirectoriesAndContractsInDirectoryResponseDto getDirectoriesAndContractsInDirectoryResponseDto
			= new GetDirectoriesAndContractsInDirectoryResponseDto(directories, contracts);

		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(
			getDirectoriesAndContractsInDirectoryResponseDto);
	}

	@PutMapping("{id}")
	@Operation(summary = "디렉토리 수정 API", description = "사용자 소유의 디렉토리 이름 또는 경로를 변경하는 API입니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청입니다."),
		@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다."),
		@ApiResponse(responseCode = "403", description = "권한이 없는 사용자입니다."),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 디렉토리입니다."),
		@ApiResponse(responseCode = "409", description = "이미 존재하는 디렉토리명입니다.")

	})
	public ResponseEntity<?> updateDirectory(@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user, @PathVariable("id") Long id, @RequestBody UpdateDirectoryRequestDto updateDirectoryRequestDto) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		if ((updateDirectoryRequestDto.getName() == null) == (updateDirectoryRequestDto.getParentId() == null)) {
			throw new CustomException(GlobalErrorCode.BAD_REQUEST);
		}

		if (updateDirectoryRequestDto.getName() != null && (updateDirectoryRequestDto.getName().isBlank() || !FileNameValidator.isValidFileName(
			updateDirectoryRequestDto.getName()))) {
			throw new CustomException(GlobalErrorCode.BAD_REQUEST);
		}

		if (updateDirectoryRequestDto.getName() != null) {
			directoryService.renameDirectory(id, updateDirectoryRequestDto.getName(), user);
		} else {
			directoryService.moveDirectory(id, updateDirectoryRequestDto.getParentId(), user);
		}

		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@DeleteMapping("{id}")
	@Operation(summary = "디렉토리 삭제 API", description = "디렉토리와 해당 디렉토리 밑의 모든 파일들을 삭제하는 API입니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200"),
		@ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다."),
		@ApiResponse(responseCode = "403", description = "권한이 없는 사용자입니다."),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 디렉토리입니다.")
	})
	public ResponseEntity<?> deleteDirectory(@Parameter(hidden = true) @SessionAttribute(name = "user", required = false) User user, @PathVariable("id") Long id) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		directoryService.deleteDirectory(id, user);

		return ResponseEntity.status(HttpStatus.OK).build();
	}
}