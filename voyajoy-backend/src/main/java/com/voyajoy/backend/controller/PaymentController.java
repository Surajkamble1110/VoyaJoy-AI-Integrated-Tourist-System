package com.voyajoy.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.RazorpayException;
import com.voyajoy.backend.dto.CreateOrderRequest;
import com.voyajoy.backend.dto.OrderResponse;
import com.voyajoy.backend.dto.PaymentRequest;
import com.voyajoy.backend.dto.PaymentResponse;
import com.voyajoy.backend.dto.VerifyPaymentRequest;
import com.voyajoy.backend.entity.Payment;
import com.voyajoy.backend.mapper.PaymentMapper;
import com.voyajoy.backend.service.IPaymentService;

@RequestMapping("/voyajoy/api/payment")
@RestController
public class PaymentController {
	
	private final IPaymentService paymentService;

    public PaymentController(IPaymentService paymentService) {
        this.paymentService = paymentService;
    }

    
    @PostMapping("/create-order")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> createPaymentOrder(
    		@RequestBody CreateOrderRequest  request) throws RazorpayException {
        
        OrderResponse response= paymentService.createOrder(request);
       
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    
    
    @PostMapping("/verify")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<PaymentResponse> verifyPayment(
    		@RequestBody VerifyPaymentRequest request) throws Exception {
        
        Payment  payment= paymentService.verifyAndSavePayment(request);
        
        PaymentResponse response = PaymentMapper.toResponse(payment);
       
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    
   
    // Get payment by ID
    @GetMapping("/get-by-id/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long paymentId) {
        
        Payment payment = paymentService.getPaymentById(paymentId);
        PaymentResponse response = PaymentMapper.toResponse(payment);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Get my payments (Customer)
    @GetMapping("/my-payments/{userId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(@PathVariable Long userId) {
        
        List<Payment> payments = paymentService.getPaymentsByUser(userId);
        List<PaymentResponse> responseList = PaymentMapper.toResponseList(payments);
        
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    // Get payments by booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByBooking(@PathVariable Long bookingId) {
        
        List<Payment> payments = paymentService.getPaymentsByBooking(bookingId);
        List<PaymentResponse> responseList = PaymentMapper.toResponseList(payments);
        
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    // Get all payments (Manager only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        
        List<Payment> payments = paymentService.getAllPayments();
        List<PaymentResponse> responseList = PaymentMapper.toResponseList(payments);
        
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    // Get payments by status (Manager)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByStatus(@PathVariable String status) {
        
        List<Payment> payments = paymentService.getPaymentsByStatus(status);
        List<PaymentResponse> responseList = PaymentMapper.toResponseList(payments);
        
        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    // Get total revenue (Manager)
    @GetMapping("/revenue/total")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Double> getTotalRevenue() {
        
        Double revenue = paymentService.getTotalRevenue();
        
        return new ResponseEntity<>(revenue, HttpStatus.OK);
    }

}
