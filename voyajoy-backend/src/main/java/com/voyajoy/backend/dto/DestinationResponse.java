package com.voyajoy.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DestinationResponse {
	
	private Long destinatonId;
	private String destinationName;
	private String location;
	private String description;
	private Double totalBudget;
	private Double advancePayment; 	                             
	private String image;         
	private String itinerary;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String message;

}
