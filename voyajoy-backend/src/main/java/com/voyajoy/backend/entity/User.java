package com.voyajoy.backend.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Table(name="users")
@NoArgsConstructor
@Entity
public class User {

	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="uid")
	@Id
	private Long userId;
	
	@Column(name="username", unique=true ,length=50, nullable=false)
	private String username;
		
	@Column(name ="password", length=255, nullable=false)
	private String password;
	
	@Column(name="email", unique=true, length=100, nullable=false)
	private String email;
	
	@Column(name="phone_number", length=20,  nullable=false)
	private String phoneNumber;
	
	@Column(name="role", length=20, nullable=false)
	private String role;
	
	@Column(name="created_at",nullable=false, updatable=false)
	private LocalDateTime createdAt;
	
	@PrePersist
	public void onCreate() {
	
		this.createdAt = LocalDateTime.now();
	}
	
}
