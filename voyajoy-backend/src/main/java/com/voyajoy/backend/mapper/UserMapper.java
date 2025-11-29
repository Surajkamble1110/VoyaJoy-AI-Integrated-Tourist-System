package com.voyajoy.backend.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.voyajoy.backend.dto.UserResponse;
import com.voyajoy.backend.entity.User;

public class UserMapper {
	
	public static UserResponse toResponse(User user ) {
		
		 return  new UserResponse(
				 
				 user.getUserId(),
				 user.getUsername(),
				 user.getEmail(),
				 user.getPhoneNumber(),
				 user.getRole(),
				 "Fetched Succesfully!"				
		);		
	}
	
	
	public static List<UserResponse> toResponseList(List<User> users){
		
	return 	users.stream().map(UserMapper :: toResponse)
		.collect(Collectors.toList());
		
	}
	
	
}
