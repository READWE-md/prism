package com.readwe.gimisangung.contract.model.repository;

import static com.readwe.gimisangung.contract.model.entity.QContract.*;
import static com.readwe.gimisangung.contract.model.entity.QTag.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
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
	private final TagRepository tagRepository;

	@Override
	public List<ContractDto> findAllByUserIdAndName(Long userId, String name) {
		List<ContractJoinTagDto> list = jpaQueryFactory
			.select(Projections.bean(
					ContractJoinTagDto.class,
					contract.id,
					contract.status,
					contract.name,
					contract.createdAt,
					tag.name.as("tagName"),
					contract.parent.id.as("parentId"))
			)
			.from(tag)
			.join(tag.contract, contract)
			.where(contract.user.id.eq(userId).and(contract.name.contains(name)))
			.orderBy(contract.id.desc())
			.fetch();

		return convertToContractDto(list);
	}

	@Override
	public List<ContractDto> findAllByUserIdAndTagName(Long userId, String tagName) {
		List<ContractJoinTagDto> list = jpaQueryFactory
			.select(Projections.bean(
				ContractJoinTagDto.class,
				contract.id,
				contract.status,
				contract.name,
				contract.createdAt,
				tag.name.as("tagName"),
				contract.parent.id.as("parentId"))
			)
			.from(tag)
			.join(tag.contract, contract)
			.where(contract.user.id.eq(userId).and(tag.name.contains(tagName)))
			.orderBy(contract.id.desc())
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