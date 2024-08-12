package com.readwe.gimisangung.contract.model.dto;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractDto {
	private Long id;
	@Enumerated(EnumType.STRING)
	private ContractStatus status;
	private String name;
	private LocalDateTime createdAt;
	private LocalDateTime viewedAt;
	private LocalDateTime startDate;
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