package com.readwe.gimisangung.user.model;

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

	@Column
	private Long oauthId;

	@Column
	private String accessToken;

	@Column
	private Integer expiresIn;

	@Column
	private String refreshToken;

	@Column
	private Integer refreshExpiresIn;

	@Setter
	@Column(name = "root_directory_id")
	private Long rootDirectoryId;
}
