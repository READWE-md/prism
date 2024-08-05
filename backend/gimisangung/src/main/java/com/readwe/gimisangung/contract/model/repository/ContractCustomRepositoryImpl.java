package com.readwe.gimisangung.contract.model.repository;

import static com.readwe.gimisangung.contract.model.entity.QContract.*;
import static com.readwe.gimisangung.contract.model.entity.QTag.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.readwe.gimisangung.contract.model.entity.Contract;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ContractCustomRepositoryImpl implements ContractCustomRepository {

	private final EntityManager em;
	private final JPAQueryFactory jpaQueryFactory;

	@Override
	public List<Contract> findAllByUserIdAndName(Long userId, String name) {
		return jpaQueryFactory.selectFrom(contract)
			.where(contract.user.id.eq(userId).and(contract.name.contains(name)))
			.fetch();
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
}