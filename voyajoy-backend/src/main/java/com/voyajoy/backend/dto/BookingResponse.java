package com.voyajoy.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.voyajoy.backend.entity.Destination;
import com.voyajoy.backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingResponse {
	
	private Long bookingId;
	private LocalDateTime bookingDate;
	private LocalDate travelDate;
	private Integer totalTravelers;
	private Double totalAmount;
	private Boolean advancePaid;
	private Double advancePayment;
	private String specialRequest;
	private String bookingStatus;
	private Long userId;
	private String username;
	private Long destinationId;
	private String destinationname;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String message;


}
