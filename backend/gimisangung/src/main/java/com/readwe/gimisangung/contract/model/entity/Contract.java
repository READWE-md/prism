package com.readwe.gimisangung.contract.model.entity;

import java.util.Date;

import com.readwe.gimisangung.directory.model.entity.File;
import com.readwe.gimisangung.user.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

	@Column(length = 255, name = "file_path")
	private String filePath;
}
