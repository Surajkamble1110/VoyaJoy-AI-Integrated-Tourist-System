package com.voyajoy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class OrderResponse {
	
	    private String orderId;
	    private Double amount;
	    private String currency;
	    private String razorpayKeyId;
	    private Long bookingId;
	    private String message;

}
