package com.voyajoy.backend.service;

import java.util.List;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.voyajoy.backend.dto.CreateOrderRequest;
import com.voyajoy.backend.dto.OrderResponse;
import com.voyajoy.backend.dto.PaymentRequest;
import com.voyajoy.backend.dto.VerifyPaymentRequest;
import com.voyajoy.backend.entity.Booking;
import com.voyajoy.backend.entity.Payment;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.exception.InvalidInputException;
import com.voyajoy.backend.exception.ResourceNotFoundException;
import com.voyajoy.backend.repository.IPaymentRepository;

@Service
public class PaymentService implements IPaymentService{
	
	@Value("${razorpay.key.id}")
	private String razorpayKeyId;
	
	 @Value("${razorpay.key.secret}")
	 private String razorpayKeySecret;
	

    private final IPaymentRepository paymentRepository;
    private final IBookingService bookingService;
    private final IUserService userService;
    private final RazorpayClient razorpayClient;

    public PaymentService(IPaymentRepository paymentRepository,
                         IBookingService bookingService,
                         IUserService userService,
                         RazorpayClient razorpayClient) {
        
    	this.paymentRepository = paymentRepository;
        this.bookingService = bookingService;
        this.userService = userService;
        this.razorpayClient=razorpayClient;
    }
    
    
    
    public OrderResponse createOrder(CreateOrderRequest request) throws RazorpayException {
 
    	
    	Booking booking  = bookingService.getBookingDetailsById(request.getBookingId());
    	
    	if(booking == null) {
    
    		 throw new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId());
    		
    	}
    	
    	if(booking.getAdvancePaid()) {
    		
    		throw new InvalidInputException("Advance payment already completed for this booking");
    	}
    	
    	
    	 Double expectedAmount = (booking.getDestination().getAdvancePayment()) * booking.getTotalTravelers();
        
    	 if (!request.getAmount().equals(expectedAmount)) {
             throw new InvalidInputException("Payment amount must be ₹" + expectedAmount);
         }
         
         JSONObject orderRequest  = new JSONObject(); 
         orderRequest.put("amount", (int)(request.getAmount() * 100));
         orderRequest.put("currency", "INR");
         orderRequest.put("receipt", "order_" + booking.getBookingId());
         
         Order order = razorpayClient.orders.create(orderRequest);
         
         return new OrderResponse (
        		 order.get("id"),
                 request.getAmount(),
                 "INR",
                 razorpayKeyId,
                 booking.getBookingId(),
                 "Order created successfully"     		 
        		 );
    	
    	
    }
    
    public Payment verifyAndSavePayment(VerifyPaymentRequest request) throws Exception {
    	
    	String signature = getSignature(request.getRazorpayOrderId(), request.getRazorpayPaymentId());
    	
    	if(!signature.equals(request.getRazorpaySignature())) {
    		
    		throw new InvalidInputException("Invalid Payment Signature");
    	}
    	
     Booking booking  = bookingService.getBookingDetailsById(request.getBookingId());
     
     if(booking== null) {
    	 
    	 throw new ResourceNotFoundException("Booking details with id " + request.getBookingId() + " not found!");
    	 
     }
     
     Payment payment = new Payment();
     payment.setAmount(booking.getDestination().getAdvancePayment());
     payment.setPaymentMethod(request.getPaymentMethod());
     payment.setPaymentStatus("SUCCESS");
     payment.setTransactionId(request.getRazorpayPaymentId());
     payment.setBooking(booking);
     payment.setUser(booking.getUser());
    Payment savePayment= paymentRepository.save(payment);
    
    booking.setAdvancePaid(true);
    booking.setBookingStatus("CONFIRMED");
    bookingService.updateBookingStatus(booking.getBookingId(), "CONFIRMED");;
     
    return savePayment;
 }
    
    
   
    
    private String getSignature(String orderId, String paymentId) throws Exception{
    	
    	
    		String data = orderId + "|" + paymentId;
    	
    	     Mac mac = Mac.getInstance("HmacSHA256");
    	     
    	     SecretKeySpec secretKeySpec = new SecretKeySpec
    	    		 (razorpayKeySecret.getBytes(), "HmacSHA256");
    	     
    	    mac.init(secretKeySpec);
    	   byte[] hash = mac.doFinal(data.getBytes()); 
    	   StringBuilder hexString = new StringBuilder();
    	   
    	   for(byte b : hash ) {
    		   
    		   String hex =  Integer.toHexString(0xff & b);
    		   
    		   if(hex.length()==1) {
    			   
    			   hexString.append("0");
    			   
    		   }
    		   
    		   hexString.append(hex);
    	   }
    	     
    	return hexString.toString();
    	
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
