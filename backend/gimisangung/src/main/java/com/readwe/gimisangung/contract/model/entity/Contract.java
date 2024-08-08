package com.readwe.gimisangung.contract.model.entity;

import com.readwe.gimisangung.directory.model.entity.File;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@ToString
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="contracts")
@DiscriminatorValue("F")
public class Contract extends File {

	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	@Setter
	private ContractStatus status;

	@Column(length = 255, name = "file_path")
	@Setter
	private String filePath;

	@Setter
	@OneToMany(mappedBy = "contract", fetch = FetchType.LAZY,
		cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Tag> tags;
}