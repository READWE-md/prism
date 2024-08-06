package com.readwe.gimisangung.contract.model.dto;

import java.util.Date;

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
	private Date createdAt;
	private String tagName;
	private Long parentId;
}
