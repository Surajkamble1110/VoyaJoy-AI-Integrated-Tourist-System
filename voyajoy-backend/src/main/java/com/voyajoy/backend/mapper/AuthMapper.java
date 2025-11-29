package com.voyajoy.backend.mapper;


import com.voyajoy.backend.dto.AuthResponse;
import com.voyajoy.backend.entity.User;

public class AuthMapper {
	
	public static AuthResponse toResponse(User user, String token) {
		
		 return  new AuthResponse(
				 
				 user.getUserId(),
				 user.getUsername(),
				 user.getEmail(),
				 user.getPhoneNumber(),
				 user.getRole(),
				 token,
				 "Successful User Data!"				
		);		
	}
}
