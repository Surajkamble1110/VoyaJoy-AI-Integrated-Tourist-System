package com.voyajoy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
	
	private Long userId;
	private String username;
	private String email;
	private String phoneNumber;
	private String role;
	private String msg;
}
