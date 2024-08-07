package com.readwe.gimisangung.contract.model.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.querydsl.core.annotations.QueryProjection;
import com.readwe.gimisangung.contract.model.entity.ContractStatus;

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
	private Date createdAt;
	private List<String> tags;
	private Long parentId;

	public ContractDto(Long id, ContractStatus status, String name, Date createdAt, Long parentId) {
		this.id = id;
		this.status = status;
		this.name = name;
		this.createdAt = createdAt;
		this.parentId = parentId;
	}

	public static ContractDto of(ContractJoinTagDto dto) {
		return ContractDto.builder()
			.id(dto.getId())
			.status(dto.getStatus())
			.name(dto.getName())
			.createdAt(dto.getCreatedAt())
			.tags(new ArrayList<>())
			.parentId(dto.getParentId())
			.build();
	}
}