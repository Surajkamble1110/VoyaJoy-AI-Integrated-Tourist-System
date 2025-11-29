package com.voyajoy.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.voyajoy.backend.entity.Payment;

public interface IPaymentRepository extends JpaRepository<Payment, Long> {
	
    Optional<Payment> findByTransactionId(String transactionId);
    
    
    List<Payment> findByUserUserId(Long userId);
    
  
    List<Payment> findByBookingBookingId(Long bookingId);
    
   
    List<Payment> findByPaymentStatus(String status);
    
    
    Long countByPaymentStatus(String status);
	
}
