package com.voyajoy.backend.controller;
import com.voyajoy.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voyajoy.backend.dto.AuthResponse;
import com.voyajoy.backend.dto.LoginRequest;
import com.voyajoy.backend.dto.RegisterRequest;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.service.IUserService;

@RequestMapping("/api/auth")
@RestController
public class AuthController {

 

	
	private final IUserService userService;
	
	public AuthController(IUserService userService, UserService userService_1) {
		
		 this.userService = userService;
		
	}
	
	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request){
		
		User user = userService.registerUser(request);
		
		AuthResponse response = new AuthResponse();
		
		response.setUserId(user.getUserId());
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setRole(user.getRole());
		response.setMsg("Registered Succesfully");
				
		return new ResponseEntity<>(response, HttpStatus.CREATED);
		
	}
	
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
		
		User user = userService.loginUser(request);
		
		AuthResponse response = new AuthResponse();
		
		response.setUserId(user.getUserId());
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setRole(user.getRole());
		response.setMsg("Login Succsesfully!");
		
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	

	@GetMapping("/profile/{id}")
	public ResponseEntity<AuthResponse> getProfile(@PathVariable Long id){
		
		User  user = userService.getUserById(id);
		
		AuthResponse response = new AuthResponse();
		
		response.setUserId(user.getUserId());
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setRole(user.getRole());
		response.setMsg("User found Succesfully");
		
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}