package com.voyajoy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class VerifyPaymentRequest {
	
	private String razorpayOrderId;
	private String razorpayPaymentId;
	private String razorpaySignature;
	private Long bookingId;
	private String paymentMethod;

}
