package com.voyajoy.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Table(name = "Destination")
@Entity
public class Destination {

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "did")
	@Id
	private Long destinationId;

	@Column(name = "destination_name", length = 100, unique = true, nullable = false)
	private String destinationName;

	@Column(name = "location", length = 100, nullable = false)
	private String location;

	@Column(name = "description", columnDefinition = "TEXT", nullable = false)
	private String description;

	@Column(name = "total_budget", nullable = false)
	private Double totalBudget;

	@Column(name = "advance_payment", nullable = false)
	private Double advancePayment;

	@Column(name = "image", length = 500)
	private String image;

	@Column(name = "itinerary", columnDefinition = "TEXT", nullable = false)
	private String itinerary;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false, updatable = true)
	private LocalDateTime updatedAt;

	@PrePersist
	public void onCreate() {

		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	public void onUpdate() {

		this.updatedAt = LocalDateTime.now();
	}

}
