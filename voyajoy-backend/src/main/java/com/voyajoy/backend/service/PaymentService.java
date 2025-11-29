package com.voyajoy.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.voyajoy.backend.dto.PaymentRequest;
import com.voyajoy.backend.entity.Booking;
import com.voyajoy.backend.entity.Payment;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.exception.InvalidInputException;
import com.voyajoy.backend.exception.ResourceNotFoundException;
import com.voyajoy.backend.repository.IPaymentRepository;

@Service
public class PaymentService implements IPaymentService{
	

    private final IPaymentRepository paymentRepository;
    private final IBookingService bookingService;
    private final IUserService userService;

    public PaymentService(IPaymentRepository paymentRepository,
                         IBookingService bookingService,
                         IUserService userService) {
        this.paymentRepository = paymentRepository;
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @Override
    public Payment createPayment(PaymentRequest request) {
        
        // Validate booking exists
        Booking booking = bookingService.getBookingDetailsById(request.getBookingId());
        
        if (booking == null) {
            throw new ResourceNotFoundException(
                "Booking not found with ID: " + request.getBookingId()
            );
        }
        
        
        if (!request.getAmount().equals(booking.getDestination().getAdvancePayment())) {
       
        	throw new InvalidInputException(
                
        			"Payment amount must be " + booking.getDestination()
                .getAdvancePayment()
            );
        }
        
        // Get user
        User user = userService.getUserById(booking.getUser().getUserId());
        
        // Create payment
        Payment payment = new Payment();
            
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus("SUCESSS");
        
        String tid = request.getTransactionId() != null ? request.getTransactionId() : UUID.randomUUID().toString();
        payment.setTransactionId(tid);
        payment.setBooking(booking);
        payment.setUser(user);
        
        Payment savedPayment = paymentRepository.save(payment);
        
  
        booking.setBookingStatus("CONFIRMED");
        booking.setAdvancePaid(true);
        bookingService.updateBookingStatus(booking.getBookingId(), "CONFIRMED");
        
        return savedPayment;
    }

    @Override
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Payment not found with ID: " + paymentId
            ));
    }

    @Override
    public List<Payment> getPaymentsByUser(Long userId) {
        
        userService.getUserById(userId);
        
        return paymentRepository.findByUserUserId(userId);
    }

    @Override
    public List<Payment> getPaymentsByBooking(Long bookingId) {
        
        Booking booking = bookingService.getBookingDetailsById(bookingId);
        
        if (booking == null) {
            throw new ResourceNotFoundException(
                "Booking not found with ID: " + bookingId
            );
        }
        
        return paymentRepository.findByBookingBookingId(bookingId);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByPaymentStatus(status);
    }

    @Override
    public Double getTotalRevenue() {
        return paymentRepository.findByPaymentStatus("SUCCESS").stream()
            .mapToDouble(Payment::getAmount)
            .sum();
    }

    @Override
    public Long countByStatus(String status) {
        return paymentRepository.countByPaymentStatus(status);
    }
}
