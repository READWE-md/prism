package com.readwe.gimisangung.contract.model.repository;

import static com.readwe.gimisangung.contract.model.entity.QContract.*;
import static com.readwe.gimisangung.contract.model.entity.QTag.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.readwe.gimisangung.contract.model.dto.ContractDto;
import com.readwe.gimisangung.contract.model.dto.ContractJoinTagDto;
import com.readwe.gimisangung.contract.model.entity.Contract;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ContractCustomRepositoryImpl implements ContractCustomRepository {

	private final EntityManager em;
	private final JPAQueryFactory jpaQueryFactory;

	@Override
	public List<ContractDto> findAllByParentIdToContractDto(Long id) {
		List<ContractJoinTagDto> list = jpaQueryFactory
			.select(
				Projections.bean(
					ContractJoinTagDto.class,
					contract.id,
					contract.status,
					contract.name,
					contract.createdAt,
					tag.name.as("tagName"),
					contract.parent.id.as("parentId"))
			)
			.from(contract)
			.leftJoin(contract.tags, tag)
			.where(contract.parent.id.eq(id))
			.orderBy(contract.createdAt.desc(), tag.name.asc())
			.fetch();

		return convertToContractDto(list);
	}

	@Override
	public List<ContractDto> findAllByUserIdAndKeyword(Long userId, String keyword) {
		List<ContractJoinTagDto> list = jpaQueryFactory
			.select(
				Projections.bean(
					ContractJoinTagDto.class,
					contract.id,
					contract.status,
					contract.name,
					contract.createdAt,
					tag.name.as("tagName"),
					contract.parent.id.as("parentId"))
			)
			.from(contract)
			.leftJoin(contract.tags, tag)
			.where(contract.user.id.eq(userId)
				.and(contract.name.contains(keyword)
					.or(contract.id.in(
							JPAExpressions.select(tag.contract.id)
								.from(tag)
								.join(tag.contract, contract)
								.where(contract.user.id.eq(userId)
									.and(tag.contract.id.eq(contract.id))
									.and(tag.name.contains(keyword)
									))
						)
					)
				)
			)
			.orderBy(contract.createdAt.desc(), tag.name.asc())
			.fetch();

		return convertToContractDto(list);
	}

	@Override
	public void deleteAllByParentId(Long parentId) {
		List<Long> contractIds = jpaQueryFactory.selectFrom(contract)
			.where(contract.parent.id.eq(parentId))
			.fetch()
			.stream()
			.map(Contract::getId)
			.toList();

		jpaQueryFactory.delete(tag)
			.where(tag.contract.id.in(contractIds))
			.execute();
		jpaQueryFactory.delete(contract)
			.where(contract.id.in(contractIds))
			.execute();

		em.flush();
		em.clear();
	}

	private List<ContractDto> convertToContractDto(List<ContractJoinTagDto> list) {
		List<ContractDto> dtos = new ArrayList<>();
		if (!list.isEmpty()) {
			int idx = 0;
			ContractJoinTagDto first = list.getFirst();
			ContractDto contractDto = ContractDto.of(first);
			dtos.add(contractDto);
			for (ContractJoinTagDto contractJoinTagDto : list) {
				ContractDto curDto = dtos.get(idx);
				if (!curDto.getId().equals(contractJoinTagDto.getId())) {
					ContractDto newDto = ContractDto.of(contractJoinTagDto);
					newDto.getTags().add(contractJoinTagDto.getTagName());
					dtos.add(newDto);
					idx++;
				} else {
					curDto.getTags().add(contractJoinTagDto.getTagName());
				}
			}
		}
		return dtos;
	}
}