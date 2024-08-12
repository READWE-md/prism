package com.readwe.gimisangung.contract.model.entity;

import com.readwe.gimisangung.directory.model.entity.File;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
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

	@Setter
	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private ContractStatus status;

	@Setter
	@OneToMany(mappedBy = "contract", fetch = FetchType.LAZY)
	private List<Tag> tags;

	@Column(name = "viewed_at")
	private LocalDateTime viewedAt;

	@Column(name = "start_date")
	private LocalDateTime startDate;

	@Column(name = "expire_date")
	private LocalDateTime expireDate;
}