package com.readwe.gimisangung.directory.model.entity;

import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.readwe.gimisangung.user.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Entity
@Getter
@ToString
@AllArgsConstructor
@DiscriminatorColumn(name = "dtype")
@EntityListeners(AuditingEntityListener.class)
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class File {
	@Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
	@Column(name = "file_id")
	private Long id;

	@Column(length = 64)
	private String name;

	@CreatedDate
	@Column(name = "created_at", updatable = false, nullable = false)
	private Date createdAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parent_id")
	private File parent;

	public void update(String newName, File newParent) {
		if (newName != null) {
			this.name = newName;
		}

		if (newParent != null) {
			this.parent = newParent;
		}
	}
}
