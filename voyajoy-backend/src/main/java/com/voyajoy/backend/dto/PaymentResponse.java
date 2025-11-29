package com.voyajoy.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {
	
	    private Long paymentId;
	    private Long bookingId;
	    private Long userId;
	    private String username;
	    private String destinationName;
	    private Double amount;
	    private String paymentMethod;
	    private String paymentStatus;
	    private String transactionId;
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
	    private String message;
}
