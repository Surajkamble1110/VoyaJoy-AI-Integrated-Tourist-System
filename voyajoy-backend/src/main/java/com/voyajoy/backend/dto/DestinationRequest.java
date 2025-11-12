package com.voyajoy.backend.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DestinationRequest {
	
	private String destinationName;
	private String location;
	private String description;
	private Double totalBudget;
	private Double advancePayment; 	                             
	private String image;         
	private String itinerary;
	
}
