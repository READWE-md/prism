package com.readwe.gimisangung.directory.model.entity;

import java.util.Date;

import com.readwe.gimisangung.user.model.User;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Entity
@Getter
@ToString(callSuper = true)
@DiscriminatorValue("D")
public class Directory extends File {
	public Directory(Long id, String name, Date createdAt, User user,
		File parent) {
		super(id, name, createdAt, user, parent);
	}
}