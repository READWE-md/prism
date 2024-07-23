package com.readwe.gimisangung.contract.exception;

import lombok.Getter;

@Getter
public class ContractException extends RuntimeException {
	private final ContractErrorCode contractErrorCode;
	private final String errorCode;
	private final String errorMessage;

	public ContractException(ContractErrorCode contractErrorCode) {
		this.contractErrorCode = contractErrorCode;
		this.errorCode = contractErrorCode.getHttpStatus().name();
		this.errorMessage = contractErrorCode.getErrorMessage();
	}
}
