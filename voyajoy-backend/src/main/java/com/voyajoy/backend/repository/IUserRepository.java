package com.voyajoy.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.voyajoy.backend.entity.User;

public interface IUserRepository extends JpaRepository<User, Long> {
	
	@Query("SELECT u FROM  User u WHERE u.username=:name")
	public abstract Optional<User> findByUsername(String name);
	
	@Query("SELECT u FROM User u Where u.email=:email")
	public abstract Optional<User> findbyUserEmail(String email);
	
	public abstract Boolean existsByUsername(String name);
	
	public abstract Boolean existsByEmail(String email);
	
	public abstract List<User> findByRole(String role);
	
}
