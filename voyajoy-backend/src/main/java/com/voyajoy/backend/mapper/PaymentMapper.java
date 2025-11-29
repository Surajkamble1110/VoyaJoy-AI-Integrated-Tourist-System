package com.voyajoy.backend.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.voyajoy.backend.dto.PaymentResponse;
import com.voyajoy.backend.entity.Payment;

public class PaymentMapper {
    
    public static PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
            payment.getPaymentId(),
            payment.getBooking().getBookingId(),
            payment.getUser().getUserId(),
            payment.getUser().getUsername(),
            payment.getBooking().getDestination().getDestinationName(),
            payment.getAmount(),
            payment.getPaymentMethod(),
            payment.getPaymentStatus(),
            payment.getTransactionId(),
            payment.getCreatedAt(),
            payment.getUpdatedAt(),
            "Payment details"
        );
    }
    
    public static List<PaymentResponse> toResponseList(List<Payment> payments) {
        return payments.stream()
            .map(PaymentMapper::toResponse)
            .collect(Collectors.toList());
    }
}