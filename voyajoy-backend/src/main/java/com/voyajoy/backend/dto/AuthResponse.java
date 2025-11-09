package com.voyajoy.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponse {
	
	private Long userId;
	private String username;
	private String email;
	private String phoneNumber;
	private String role;
	private String msg;
}
