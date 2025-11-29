package com.voyajoy.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.voyajoy.backend.dto.LoginRequest;
import com.voyajoy.backend.dto.RegisterRequest;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.exception.DuplicateResourceException;
import com.voyajoy.backend.exception.ResourceNotFoundException;
import com.voyajoy.backend.exception.UnauthorizedException;
import com.voyajoy.backend.repository.IUserRepository;

@Service
public class UserService implements IUserService {
	
	private final IUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	
	public UserService(IUserRepository usrerRepository, PasswordEncoder passwordEncoder) {
	  
		this.userRepository= usrerRepository;
		this.passwordEncoder = passwordEncoder;
	}
	
	
	@Override
	public User registerUser(RegisterRequest request) {
		
		if(userRepository.existsByUsername(request.getUsername())) {
			
			throw new DuplicateResourceException("Username already exist: " + request.getUsername());
		}

		
		if(userRepository.existsByEmail(request.getEmail())){
			
			throw new DuplicateResourceException("Email already exist: " + request.getEmail());
		}
		
		User user = new User();
		
		user.setUsername(request.getUsername());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setPhoneNumber(request.getPhoneNumber());
		user.setRole(request.getRole());
		
		return userRepository.save(user);
	}


	@Override
	public User loginUser(LoginRequest request) {
		
	 User user = userRepository.findByUsername(request.getUsername())
			 .orElseThrow(()-> new ResourceNotFoundException("User not found with username: " + request.getUsername()));
	 
	 if(!(passwordEncoder.matches(request.getPassword(), user.getPassword()))) {
		 
		 throw new UnauthorizedException("Invalid Password");
		}
	 
	 
		return user;
	}


	@Override
	public User getUserById(Long id) {
		
		return userRepository.findById(id)
		.orElseThrow(()-> new ResourceNotFoundException ("UserId not found: " + id));
		 
	}


	@Override
	public List<User> getAllCustomers() {
		
		 return userRepository.findByRole("CUSTOMER");
		

	}



	@Override
	public List<User> getAllUsers() {
		
		return  userRepository.findAll();
	}


	@Override
	public Long getTotalUsersCount() {
		
		return userRepository.count();
	}


}
