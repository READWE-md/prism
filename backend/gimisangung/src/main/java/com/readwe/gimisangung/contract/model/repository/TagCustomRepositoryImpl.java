package com.readwe.gimisangung.contract.model.repository;

import static com.readwe.gimisangung.contract.model.entity.QTag.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TagCustomRepositoryImpl implements TagCustomRepository {

	private final EntityManager em;
	private final JPAQueryFactory jpaQueryFactory;

	@Override
	public List<String> findTop6TagNames(Long userId) {
		return jpaQueryFactory.select(tag.name)
			.from(tag)
			.where(tag.user.id.eq(userId).and(tag.name.ne("-").and(tag.name.isNotNull())))
			.orderBy(tag.viewedAt.desc())
			.fetch();
	}
}
