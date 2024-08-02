package com.readwe.gimisangung.contract.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.readwe.gimisangung.contract.model.entity.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {
}
