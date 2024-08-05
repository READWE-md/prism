package com.readwe.gimisangung.user.model;

import com.readwe.gimisangung.contract.model.entity.Contract;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@Entity
@Table(name="users")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	private Long id;

	@Column(length = 15)
	private String username;

	@Column(length = 32)
	private String email;

	@Column(length = 128)
	private String password;

	@Column(length = 128)
	private String salt;

	@Column(name = "root_dir_id")
	@Setter
	private Long rootDirId;
}
