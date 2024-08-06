package com.readwe.gimisangung.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
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
	@Column(name = "user_id")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq")
	@SequenceGenerator(name = "users_seq", sequenceName = "users_seq", allocationSize = 1)
	private Long id;

	@Column(name = "oauth_id")
	private Long oauthId;

	@Column(name = "access_token")
	private String accessToken;

	@Column(name = "expires_in")
	private Integer expiresIn;

	@Column(name = "refresh_token")
	private String refreshToken;

	@Column(name = "refresh_expires_in")
	private Integer refreshExpiresIn;

	@Setter
	@Column(name = "root_directory_id")
	private Long rootDirectoryId;
}
