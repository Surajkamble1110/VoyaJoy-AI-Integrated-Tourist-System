package com.voyajoy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@AllArgsConstructor
@Data
public class PaymentRequest {
	

    private Long bookingId;
    private Double amount;
    private String paymentMethod;  
    private String transactionId;
    
}
