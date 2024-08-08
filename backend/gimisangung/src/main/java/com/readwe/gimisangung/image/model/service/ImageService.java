package com.readwe.gimisangung.image.model.service;

import org.springframework.stereotype.Service;

@Service
public interface ImageService {
	void deleteImagesByContractId(Long id);
}
