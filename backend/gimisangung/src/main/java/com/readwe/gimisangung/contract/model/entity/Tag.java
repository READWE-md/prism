package com.readwe.gimisangung.contract.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="tags")
public class Tag {
	@Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tags_seq")
	@SequenceGenerator(name = "tags_seq", sequenceName = "tags_seq", allocationSize = 1)
	@Column(name = "tag_id")
	private Long id;

	@Column(length = 30)
	private String name;

	@Setter
	@ManyToOne
	@JoinColumn(name = "contract_id")
	private Contract contract;
}
