package com.readwe.gimisangung.contract.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.readwe.gimisangung.contract.model.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long>, TagCustomRepository {
	List<Tag> findAllByContractId(Long id);

	Optional<List<Tag>> findAllByName(String tag);

	void deleteAllByContractId(Long id);
}