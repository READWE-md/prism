package com.readwe.gimisangung.image.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readwe.gimisangung.image.model.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

	void deleteAllByContractId(Long id);
	List<Image> findAllByContractIdOrderById(Long id);
}
