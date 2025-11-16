package com.voyajoy.backend.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class BookingRequest {
	
	private LocalDate travelDate;
	private Integer totalTravelers;
	private String specialRequest;

}
