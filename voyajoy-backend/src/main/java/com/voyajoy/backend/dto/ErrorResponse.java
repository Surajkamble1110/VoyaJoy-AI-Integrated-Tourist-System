package com.voyajoy.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ErrorResponse {
	
	private LocalDateTime timestamp;
	private Integer status;
	private String error;
	private String message;
	private String path;
	
	
	public ErrorResponse(Integer status, String error, String message, String path) {

		this.timestamp = LocalDateTime.now();
		this.status = status;
		this.error = error;
		this.message = message;
		this.path = path;
	}
	
	
	
	
}
