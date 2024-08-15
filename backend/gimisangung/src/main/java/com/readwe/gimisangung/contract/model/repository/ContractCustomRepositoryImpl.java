package com.readwe.gimisangung.contract.model.repository;

import static com.readwe.gimisangung.contract.model.entity.QContract.*;
import static com.readwe.gimisangung.contract.model.entity.QTag.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.readwe.gimisangung.contract.model.dto.ContractDto;
import com.readwe.gimisangung.contract.model.entity.Contract;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ContractCustomRepositoryImpl implements ContractCustomRepository {

	private final EntityManager em;
	private final JPAQueryFactory jpaQueryFactory;

	@Override
	public List<ContractDto> findAllByParentId(Long id) {
		List<Contract> contracts = jpaQueryFactory
			.selectFrom(contract)
			.join(contract.tags, tag).fetchJoin()
			.where(contract.parent.id.eq(id))
			.orderBy(contract.viewedAt.desc())
			.fetch();

		return contracts.stream().map(ContractDto::of).toList();
	}

	// @Override
	// public List<ContractDto> findAllByUserIdAndKeyword(Long userId, String keyword) {
	// 	List<ContractJoinTagDto> list = jpaQueryFactory
	// 		.select(
	// 			Projections.bean(
	// 				ContractJoinTagDto.class,
	// 				contract.id,
	// 				contract.status,
	// 				contract.name,
	// 				contract.createdAt,
	// 				tag.name.as("tagName"),
	// 				contract.parent.id.as("parentId"))
	// 		)
	// 		.from(contract)
	// 		.leftJoin(contract.tags, tag)
	// 		.where(contract.user.id.eq(userId)
	// 			.and(contract.name.contains(keyword)
	// 				.or(contract.id.in(
	// 						JPAExpressions.select(tag.contract.id)
	// 							.from(tag)
	// 							.join(tag.contract, contract)
	// 							.where(contract.user.id.eq(userId)
	// 								.and(tag.contract.id.eq(contract.id))
	// 								.and(tag.name.contains(keyword)
	// 								))
	// 					)
	// 				)
	// 			)
	// 		)
	// 		.orderBy(contract.id.desc(), tag.id.asc())
	// 		.fetch();
	//
	// 		return convertToContractDto(list);
	// }

	@Override
	public List<ContractDto> findByUserIdAndParams(Long id, Map<String, Object> params) {
		BooleanBuilder booleanBuilder = new BooleanBuilder();
		Object keyword = params.get("keyword");
		Object startDate = params.get("startDate");
		Object endDate = params.get("endDate");

		if (keyword != null) {
			String k = (String) keyword;
			booleanBuilder.and(contract.name.containsIgnoreCase(k)
				.or(contract.tags.any().name.containsIgnoreCase(k))
			);
		}

		if (startDate != null && endDate != null) {
			LocalDateTime start = (LocalDateTime) startDate;
			LocalDateTime end = (LocalDateTime) endDate;
			// booleanBuilder.andNot(contract.startDate.isNull()
			// 			.or(contract.startDate.after(end)))
			// 	.orNot(contract.expireDate.isNull()
			// 		.or(contract.expireDate.before(start)));
			booleanBuilder.and(contract.startDate.isNotNull()
					.and(contract.startDate.goe(start).and(contract.startDate.loe(end))
					.or(contract.startDate.loe(start).and(contract.expireDate.isNull()))));

			booleanBuilder.or(contract.startDate.isNotNull().and(contract.expireDate.isNotNull())
					.and(contract.expireDate.goe(start).and(contract.expireDate.loe(end))
						.or(contract.expireDate.goe(end).and(contract.startDate.loe(end)))));
		}

		List<Contract> contracts = jpaQueryFactory.selectFrom(contract)
			.join(contract.tags, tag).fetchJoin()
			.where(contract.user.id.eq(id).and(booleanBuilder))
			.orderBy(contract.viewedAt.desc())
			.fetch();

		if (keyword != null) {
			jpaQueryFactory.update(tag)
				.set(tag.viewedAt, LocalDateTime.now())
				.where(tag.contract.in(contracts))
				.execute();

			em.flush();
			em.clear();
		}

		return contracts.stream().map(ContractDto::of).toList();
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

	// private List<ContractDto> convertToContractDto(List<ContractJoinTagDto> list) {
	// 	List<ContractDto> dtos = new ArrayList<>();
	// 	if (!list.isEmpty()) {
	// 		int idx = 0;
	// 		ContractJoinTagDto first = list.getFirst();
	// 		ContractDto contractDto = ContractDto.of(first);
	// 		dtos.add(contractDto);
	// 		for (ContractJoinTagDto contractJoinTagDto : list) {
	// 			ContractDto curDto = dtos.get(idx);
	// 			if (!curDto.getId().equals(contractJoinTagDto.getId())) {
	// 				ContractDto newDto = ContractDto.of(contractJoinTagDto);
	// 				newDto.getTags().add(contractJoinTagDto.getTagName());
	// 				dtos.add(newDto);
	// 				idx++;
	// 			} else {
	// 				curDto.getTags().add(contractJoinTagDto.getTagName());
	// 			}
	// 		}
	// 	}
	// 	return dtos;
	// }
}
