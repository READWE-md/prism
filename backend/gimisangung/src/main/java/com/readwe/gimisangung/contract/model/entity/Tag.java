package com.readwe.gimisangung.contract.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class Tag {
	@Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "tag_id")
	private Long id;

	@Column(length = 15)
	private String name;

	@ManyToOne
	@JoinColumn(name = "contract_id")
	private Contract contract;
}
