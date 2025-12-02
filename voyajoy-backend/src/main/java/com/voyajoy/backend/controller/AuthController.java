package com.voyajoy.backend.controller;


import com.voyajoy.backend.util.JwtUtil;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voyajoy.backend.dto.AuthResponse;
import com.voyajoy.backend.dto.LoginRequest;
import com.voyajoy.backend.dto.RegisterRequest;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.mapper.AuthMapper;
import com.voyajoy.backend.service.IUserService;

@RequestMapping("/voyajoy/api/auth")
@RestController
public class AuthController {
	
	private final IUserService userService;
	private final  JwtUtil jwtUtil;
	
	public AuthController(IUserService userService, JwtUtil jwtUtil) {
		
		 this.userService = userService;
		 this.jwtUtil = jwtUtil;
	}
	
	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request){
		
		User user = userService.registerUser(request);
		
		 String token = jwtUtil.generateToken(user.getUserId(), user.getUsername(), user.getRole());
		
		
		AuthResponse response = AuthMapper.toResponse(user, token);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
		
	}
	
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
		
		User user = userService.loginUser(request);
		
		String token = jwtUtil.generateToken(user.getUserId(), user.getUsername(), user.getRole());
		
	    AuthResponse response = AuthMapper.toResponse(user, token);
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}