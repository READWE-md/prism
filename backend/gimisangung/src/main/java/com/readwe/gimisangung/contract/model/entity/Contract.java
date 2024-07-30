package com.readwe.gimisangung.contract.model.entity;

import java.util.Date;

import com.readwe.gimisangung.directory.model.entity.File;
import com.readwe.gimisangung.user.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.ToString;

@Entity
@Getter
@ToString
@DiscriminatorValue("F")
public class Contract extends File {

	public Contract(Long id, String name, Date createdAt, User user,
		File parent, String filePath) {
		super(id, name, createdAt, user, parent);
		this.filePath = filePath;
	}

	@Column(length = 255, name = "file_path")
	private String filePath;
}
