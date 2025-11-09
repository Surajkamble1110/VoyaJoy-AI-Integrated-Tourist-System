package com.voyajoy.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.voyajoy.backend.dto.LoginRequest;
import com.voyajoy.backend.dto.RegisterRequest;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.repository.IUserRepository;

@Service
public class UserService implements IUserService {
	
	private final IUserRepository userRepository;
	
	public UserService(IUserRepository usrerRepository ) {
	  
		this.userRepository= usrerRepository;
	}
	
	
	@Override
	public User registerUser(RegisterRequest request) {
		
		if(userRepository.existsByUsername(request.getUsername())) {
			
			throw new RuntimeException("User already exists!");
		}

		
		if(userRepository.existsByEmail(request.getEmail())){
			
			throw new RuntimeException("User already exists!");
		}
		
		User user = new User();
		
		user.setUsername(request.getUsername());
		user.setEmail(request.getEmail());
		user.setPassword(request.getPassword());
		user.setPhoneNumber(request.getPhoneNumber());
		user.setRole(request.getRole());
		
		return userRepository.save(user);
	}


	@Override
	public User loginUser(LoginRequest request) {
		
	 User user = userRepository.findByUsername(request.getUsername())
			 .orElseThrow(()-> new RuntimeException("User not found!"));
	 
	 if(!user.getPassword().equals(request.getPassword())) {
		 
		 throw new RuntimeException("Invalid Credentials");
		}
	 
	 
		return user;
	}


	@Override
	public User getUserById(Long id) {
		
		return userRepository.findById(id)
		.orElseThrow(()-> new RuntimeException("User not found!"));
		 
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
