package com.readwe.gimisangung.contract.model.dto;

import java.util.Date;
import java.util.List;

import com.querydsl.core.annotations.QueryProjection;
import com.readwe.gimisangung.contract.model.entity.ContractStatus;
import com.readwe.gimisangung.contract.model.entity.Tag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
public class FindContractResultDto {
	private Long id;
	private ContractStatus status;
	private String name;
	private Date created_at;
	private List<Tag> tags;
	private Long parentId;

	@QueryProjection
	public FindContractResultDto(Long id, ContractStatus status, String name, Date created_at, List<Tag> tags,
		Long parentId) {
		this.id = id;
		this.status = status;
		this.name = name;
		this.created_at = created_at;
		this.tags = tags;
		this.parentId = parentId;
	}
}
