package com.voyajoy.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voyajoy.backend.dto.AuthResponse;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.service.IUserService;

@RequestMapping("/api/manager")
@RestController
public class ManagerController {
	
	private final IUserService userService;
	
	public ManagerController(IUserService userService) {
		
		this.userService = userService;
	}
	
	
	@GetMapping("/customers")
	public ResponseEntity<List<AuthResponse>> getCostumers(){
		
		List<User> customers = userService.getAllCustomers();
		
	List<AuthResponse> responseList =	customers.stream().map((user)->{
			
			 AuthResponse response = new AuthResponse();
			
			        response.setUserId(user.getUserId());
			        response.setUsername(user.getUsername());
			        response.setEmail(user.getEmail());
			        response.setPhoneNumber(user.getPhoneNumber());
			        response.setRole(user.getRole());
			        response.setMsg("Customer data");
			        
			        return response;
			        
		}).collect(Collectors.toList());
		
		
		return new ResponseEntity<>(responseList, HttpStatus.OK);
		
	}
	
	
	@GetMapping("/users")
	public ResponseEntity<List<AuthResponse>> fetchAllUsers(){
		
	List<User> 	users = userService.getAllUsers();
	
	List<AuthResponse> responseList  =  users.stream().map((user)->{
		
		AuthResponse response = new AuthResponse();
		response.setUserId(user.getUserId());
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setRole(user.getRole());
		response.setMsg("Data fetched Successfuly!");
		
		return response;
	}).collect(Collectors.toList());
	
	   return new ResponseEntity<>( responseList , HttpStatus.OK);
	
	}
	
	
	@GetMapping("/user-count")
	public ResponseEntity<Map<String, Long>> fetchTotalUsersCount(){
		
		Long count = userService.getTotalUsersCount();
		
		Map<String, Long> response = new HashMap<>();
		response.put("Toatal users", count);
		
		return new ResponseEntity<>(response, HttpStatus.OK);
		
	}
	
}
