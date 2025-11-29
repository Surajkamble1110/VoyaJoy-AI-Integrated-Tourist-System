package com.voyajoy.backend.service;

import java.util.List;

import com.voyajoy.backend.dto.PaymentRequest;
import com.voyajoy.backend.entity.Payment;

public interface IPaymentService {

    Payment createPayment(PaymentRequest request);
    
    Payment getPaymentById(Long paymentId);
    
    List<Payment> getPaymentsByUser(Long userId);
    
    
    List<Payment> getPaymentsByBooking(Long bookingId);
    
   
    List<Payment> getAllPayments();
    
  
    List<Payment> getPaymentsByStatus(String status);
    
    
    Double getTotalRevenue();
    
   
    Long countByStatus(String status);

}
