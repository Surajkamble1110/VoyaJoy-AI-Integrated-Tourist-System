package com.voyajoy.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voyajoy.backend.dto.UserResponse;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.mapper.UserMapper;
import com.voyajoy.backend.service.IUserService;


@RequestMapping("/voyajoy/api/user")
@RestController
public class UserController {

	private final IUserService userService;
	
	
	public UserController(IUserService userService) {
		
		 this.userService = userService;
	}
	
	
	@GetMapping("/profile/{id}")
	public ResponseEntity<UserResponse> getProfile(@PathVariable Long id){
		
		User  user = userService.getUserById(id);
		
	UserResponse response = UserMapper.toResponse(user);
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
}
