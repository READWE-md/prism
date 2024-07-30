package com.readwe.gimisangung.directory.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttribute;

import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.service.ContractService;
import com.readwe.gimisangung.directory.model.vo.UpdateDirectoryVo;
import com.readwe.gimisangung.directory.model.dto.GetDirectoriesAndContractsInDirectoryDto;
import com.readwe.gimisangung.directory.model.entity.Directory;
import com.readwe.gimisangung.directory.model.service.DirectoryService;
import com.readwe.gimisangung.directory.model.vo.CreateDirectoryVo;
import com.readwe.gimisangung.exception.CustomException;
import com.readwe.gimisangung.user.exception.UserErrorCode;
import com.readwe.gimisangung.user.model.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/directories")
public class DirectoryController {

	private final DirectoryService directoryService;
	private final ContractService contractService;

	@PostMapping("")
	public ResponseEntity<?> createDirectory(@SessionAttribute(name = "user", required = false) User user, @RequestBody
		@Validated CreateDirectoryVo createDirectoryVo) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		directoryService.createDirectory(createDirectoryVo, user);

		return ResponseEntity.status(HttpStatus.CREATED).contentType(MediaType.APPLICATION_JSON).build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getDirectoriesAndContractsInDirectory(@SessionAttribute(name = "user", required = false) User user, @RequestParam(name = "id") Long id) {

		if (user == null) {
			throw new CustomException(UserErrorCode.UNAUTHORIZED);
		}

		List<Directory> directories = directoryService.getDirectoriesByParentId(id, user);
		List<Contract> contracts = contractService.getContractsByParentId(id, user);

		GetDirectoriesAndContractsInDirectoryDto getDirectoriesAndContractsInDirectoryDto = new GetDirectoriesAndContractsInDirectoryDto(directories, contracts);
		return ResponseEntity.status(HttpStatus.OK).body(getDirectoriesAndContractsInDirectoryDto);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateDirectory(@SessionAttribute(name = "user") User user, @RequestParam(name = "id") Long id, @RequestBody UpdateDirectoryVo updateDirectoryVo) {

		// todo: 새로운 이름과 부모 디렉토리가 모두 없거나 모두 있는 경우 예외(400) 발생
		if ((updateDirectoryVo.getName() == null) == (updateDirectoryVo.getParentId() == null)) {
			throw new RuntimeException();
		}

		// todo: 새로운 이름이 있는데 공백으로만 이루어진 문자열인 경우 예외(400) 발생
		if (updateDirectoryVo.getName() != null && updateDirectoryVo.getName().isBlank()) {
			throw new RuntimeException();
		}

		if (updateDirectoryVo.getName() != null) {
			directoryService.renameDirectory(id, updateDirectoryVo.getName(), user);
		} else {
			directoryService.moveDirectory(id, updateDirectoryVo.getParentId(), user);
		}

		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteFiles(@SessionAttribute(name = "user") User user, @RequestParam(name = "id") Long id) {

		directoryService.deleteDirectory(id, user);

		return ResponseEntity.status(HttpStatus.OK).build();
	}
}