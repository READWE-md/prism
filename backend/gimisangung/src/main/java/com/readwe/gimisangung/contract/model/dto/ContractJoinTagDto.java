package com.readwe.gimisangung.contract.model.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.readwe.gimisangung.contract.model.entity.ContractStatus;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ContractJoinTagDto {

	private Long id;
	@Enumerated(EnumType.STRING)
	private ContractStatus status;
	private String name;
	@JsonFormat(timezone = "Asia/Seoul")
	private LocalDateTime createdAt;
	@JsonFormat(timezone = "Asia/Seoul")
	private LocalDateTime viewedAt;
	@JsonFormat(timezone = "Asia/Seoul")
	private LocalDateTime startDate;
	@JsonFormat(timezone = "Asia/Seoul")
	private LocalDateTime expireDate;
	private String tagName;
	private Long parentId;
}
