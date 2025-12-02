package com.voyajoy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateOrderRequest {
	
	private Long bookingId;
	private Double amount;
}
