package com.readwe.gimisangung.contract.model.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.readwe.gimisangung.contract.model.entity.Contract;
import com.readwe.gimisangung.contract.model.entity.QContract;
import com.readwe.gimisangung.contract.model.entity.QTag;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ContractCustomRepositoryImpl implements ContractCustomRepository {

	private final JPAQueryFactory jpaQueryFactory;

	@Override
	public List<Contract> findAllByUserIdAndName(Long userId, String name) {
		QContract contract = new QContract("contract");

		return jpaQueryFactory.selectFrom(contract)
			.where(contract.user.id.eq(userId).and(contract.name.contains(name)))
			.fetch();
	}
}