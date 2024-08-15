package com.readwe.gimisangung.contract.model.repository;

import static com.readwe.gimisangung.contract.model.entity.QTag.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.readwe.gimisangung.contract.model.entity.Tag;

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
			.where(tag.user.id.eq(userId)
				.and(tag.name.ne(".")
					.and(tag.name.ne("-")
						.and(tag.name.isNotNull()))))
			.distinct()
			.orderBy(tag.viewedAt.desc())
			.limit(6)
			.fetch();
	}

	@Override
	public boolean updateViewedAt(List<Tag> tags) {
		jpaQueryFactory.update(tag)
			.where(tag.in(tags))
			.set(tag.viewedAt, LocalDateTime.now())
			.execute();

		em.flush();
		em.clear();

		return true;
	}
}
