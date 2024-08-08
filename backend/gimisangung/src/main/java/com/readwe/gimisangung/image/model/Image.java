package com.readwe.gimisangung.image.model;

import com.readwe.gimisangung.contract.model.entity.Contract;

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
import lombok.ToString;

@Entity
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name="images")
public class Image {

	@Id
	@Column(name = "image_id")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "images_seq")
	@SequenceGenerator(name = "images_seq", sequenceName = "images_seq", allocationSize = 1)
	private Long id;

	@Setter
	@ManyToOne
	@JoinColumn(name = "contract_id")
	private Contract contract;

	@Setter
	@Column(length = 36, name = "file_name")
	private String fileName;
}
