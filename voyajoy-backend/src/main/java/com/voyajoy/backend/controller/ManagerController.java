package com.voyajoy.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.voyajoy.backend.dto.BookingResponse;
import com.voyajoy.backend.dto.UserResponse;
import com.voyajoy.backend.entity.Booking;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.mapper.BookingMapper;
import com.voyajoy.backend.mapper.UserMapper;
import com.voyajoy.backend.service.IBookingService;
import com.voyajoy.backend.service.IDestinationService;
import com.voyajoy.backend.service.IUserService;

@RequestMapping("/voyajoy/api/manager")
@RestController
public class ManagerController {

	
	private final IUserService userService;
	private final IDestinationService destinationService;
	private final IBookingService bookingService;
 	
	public ManagerController(IUserService userService, 
 			           IDestinationService destinationService,
 			          IBookingService bookingService) {
		
		this.userService = userService;
		this.destinationService = destinationService;
		this.bookingService = bookingService;
	
 	}
	
	
	@GetMapping("/customers")
	public ResponseEntity<List<UserResponse>> getCostumers(){
		
		List<User> customers = userService.getAllCustomers();
		
		List<UserResponse>  responseList = UserMapper.toResponseList(customers);
		
		return new ResponseEntity<>(responseList, HttpStatus.OK);
		
	}
	
	
	@GetMapping("/users")
	public ResponseEntity<List<UserResponse>> fetchAllUsers(){
		
	List<User> 	users = userService.getAllUsers();
	
	List<UserResponse>  responseList = UserMapper.toResponseList(users);
	
	   return new ResponseEntity<>( responseList , HttpStatus.OK);
	
	}
	
	
	@GetMapping("/user-count")
	public ResponseEntity<Map<String, Long>> fetchTotalUsersCount(){
		
		Long count = userService.getTotalUsersCount();
		
		Map<String, Long> response = new HashMap<>();
		response.put("Toatal users", count);
		
		return new ResponseEntity<>(response, HttpStatus.OK);
		
	}
	
	
	@GetMapping("/destination/count")
	public ResponseEntity<Map<String, Long>>destinationsTotalCount(){
				
		Long count =destinationService.getTotalDestinationsCount();
		
		Map<String, Long> response = new HashMap<>();
		response.put("Total count: ", count);
		
		return new ResponseEntity<>(response, HttpStatus.OK);
				
	}
	
	
	@PatchMapping("/booking/update-status/{id}/{status}")
	public ResponseEntity<BookingResponse> modifyBookingStatus(
			                             @PathVariable("id") Long bookingid,
	                                     @PathVariable("status") String newStatus){
		
		 Booking booking = bookingService.updateBookingStatus(bookingid, newStatus);
		 
		 BookingResponse response= BookingMapper.toResponse(booking);
		 
		 return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	@GetMapping("/booking/get-all")
	public ResponseEntity<List<BookingResponse>> fetchAllBookings(){
		
		List<Booking> bookings  = bookingService.getAllBookings();
		
		List<BookingResponse> responseList = BookingMapper.toResponseList(bookings);
		
		return new ResponseEntity<>(responseList, HttpStatus.OK); 
		
	}
	
	
	@GetMapping("/booking/get-by-status/{status}")
	public ResponseEntity<List<BookingResponse>> fetchBookingsByStatus(@PathVariable String status){
		
		List<Booking> bookings  = bookingService.getBookingByStatus(status);
		
		List<BookingResponse> responseList = BookingMapper.toResponseList(bookings);
		
		return new ResponseEntity<>(responseList, HttpStatus.OK); 
		
	}
	
	@GetMapping("/booking/get-by-destination/{destinationId}")
	public ResponseEntity<List<BookingResponse>> fetchBookingsByDestination(@PathVariable Long destinationId){
		
		List<Booking> bookings  = bookingService.getBookingsByDestination(destinationId);
		
		List<BookingResponse> responseList = BookingMapper.toResponseList(bookings);
		
		return new ResponseEntity<>(responseList, HttpStatus.OK); 
		
	}

	@GetMapping("/booking/count")
	public ResponseEntity<Map<String, Long>> fetchTotalBookingsCount(){
		
		 Long count = bookingService.getTotalBookingsCount();
		 		 
		Map<String, Long> response = new HashMap<>();
		response.put("Total Bookings ", count);
		
		return new ResponseEntity<>(response, HttpStatus.OK); 
	}
	
	
	@GetMapping("/booking/pending-count")
	public ResponseEntity<Map<String, Long>> fetchPendingBookingsCount(){
		
		 Long count = bookingService.getPendingBookingsCount();
		 		 
		Map<String, Long> response = new HashMap<>();
		response.put("Total Pending Bookings ", count);
		
		return new ResponseEntity<>(response, HttpStatus.OK); 
	}
	

}
