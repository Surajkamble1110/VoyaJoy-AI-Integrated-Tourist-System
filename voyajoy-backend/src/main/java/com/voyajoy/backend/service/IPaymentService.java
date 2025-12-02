package com.voyajoy.backend.service;

import java.util.List;

import com.razorpay.RazorpayException;
import com.voyajoy.backend.dto.CreateOrderRequest;
import com.voyajoy.backend.dto.OrderResponse;
import com.voyajoy.backend.dto.PaymentRequest;
import com.voyajoy.backend.dto.VerifyPaymentRequest;
import com.voyajoy.backend.entity.Payment;

public interface IPaymentService {

	
	public OrderResponse createOrder(CreateOrderRequest request) throws RazorpayException; 
    Payment createPayment(PaymentRequest request);
    
    public Payment verifyAndSavePayment(VerifyPaymentRequest request) throws Exception;
   
    Payment getPaymentById(Long paymentId);
    
    List<Payment> getPaymentsByUser(Long userId);
    
    
    List<Payment> getPaymentsByBooking(Long bookingId);
    
   
    List<Payment> getAllPayments();
    
  
    List<Payment> getPaymentsByStatus(String status);
    
    
    Double getTotalRevenue();
    
   
    Long countByStatus(String status);

}
