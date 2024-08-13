package com.readwe.gimisangung.contract.model.dto;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.ContractStatus;
import com.readwe.gimisangung.contract.model.entity.Tag;

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
public class ContractDto {
	private Long id;
	@Enumerated(EnumType.STRING)
	private ContractStatus status;
	private String name;
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
	private LocalDateTime createdAt;
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
	private LocalDateTime viewedAt;
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
	private LocalDateTime startDate;
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "Asia/Seoul")
	private LocalDateTime expireDate;
	private List<String> tags;
	private Long parentId;

	public static ContractDto of(Contract contract) {
		return ContractDto.builder()
			.id(contract.getId())
			.status(contract.getStatus())
			.name(contract.getName())
			.createdAt(contract.getCreatedAt())
			.viewedAt(contract.getViewedAt())
			.startDate(contract.getStartDate())
			.expireDate(contract.getExpireDate())
			.tags(contract.getTags().stream().sorted(Comparator.comparingLong(Tag::getId)).map(Tag::getName).toList())
			.parentId(contract.getParent().getId())
			.build();
	}
}