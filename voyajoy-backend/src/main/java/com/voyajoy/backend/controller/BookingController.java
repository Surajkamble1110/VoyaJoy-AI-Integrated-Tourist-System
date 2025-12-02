package com.voyajoy.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voyajoy.backend.dto.BookingRequest;
import com.voyajoy.backend.dto.BookingResponse;
import com.voyajoy.backend.entity.Booking;
import com.voyajoy.backend.mapper.BookingMapper;
import com.voyajoy.backend.service.IBookingService;

@RequestMapping("/voyajoy/api/booking")
@RestController
public class BookingController {
	
	private final IBookingService bookingService;

	public BookingController(IBookingService bookingService) {
		
		this.bookingService = bookingService;
	}
	
	
	@PreAuthorize("hasRole('CUSTOMER')")	
	@PostMapping("/create/{uid}/{did}")
	public ResponseEntity<BookingResponse> initializeBooking(@RequestBody BookingRequest request, 
			                                            @PathVariable("uid") Long userId, 
			                                            @PathVariable("did") Long destinationId){
		
		Booking booking = bookingService.createBooking(userId, destinationId, request);
		
		  BookingResponse response = BookingMapper.toResponse(booking);
		
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}
	
	@PreAuthorize("hasRole('CUSTOMER')")
	@GetMapping("/my-bookings/{id}")
	public ResponseEntity<List<BookingResponse>> getMyBookings(@PathVariable("id")
	                                                           Long userId){
				
		List<Booking> bookings = bookingService.getAllBookingsOfUser(userId);
		
		List<BookingResponse> responseList =  BookingMapper.toResponseList(bookings);
		
		
		return new ResponseEntity<>(responseList, HttpStatus.OK);
		
	}
	
	 @PreAuthorize("hasRole('CUSTOMER')")
	@GetMapping("/get-by-id/{id}")
	public ResponseEntity<BookingResponse> bookingDetailsById(@PathVariable("id")
	                                                            Long bookingId){
		
		Booking booking = bookingService.getBookingDetailsById(bookingId);
		
		BookingResponse response = BookingMapper.toResponse(booking);
		
		return new ResponseEntity<>( response, HttpStatus.OK);
	}
	
	
	 @PreAuthorize("hasRole('CUSTOMER')")
	@DeleteMapping("/delete/{bookingId}")
	public ResponseEntity<Map<String,String>> cancelBooking(@PathVariable Long bookingId ){
		
		
		bookingService.deleteBooking(bookingId);
		
		Map<String, String> response = new HashMap<>();
		response.put("Status","Booking Cancel Successfully");
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
}
