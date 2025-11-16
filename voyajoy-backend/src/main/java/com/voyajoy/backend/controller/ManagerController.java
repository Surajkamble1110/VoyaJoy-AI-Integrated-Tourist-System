package com.voyajoy.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voyajoy.backend.dto.AuthResponse;
import com.voyajoy.backend.dto.BookingResponse;
import com.voyajoy.backend.entity.Booking;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.mapper.BookingMapper;
import com.voyajoy.backend.service.IBookingService;
import com.voyajoy.backend.service.IDestinationService;
import com.voyajoy.backend.service.IUserService;

@RequestMapping("/api/manager")
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
	public ResponseEntity<List<AuthResponse>> getCostumers(){
		
		List<User> customers = userService.getAllCustomers();
		
	List<AuthResponse> responseList =	customers.stream().map((user)->{
			
			 AuthResponse response = new AuthResponse();
			
			        response.setUserId(user.getUserId());
			        response.setUsername(user.getUsername());
			        response.setEmail(user.getEmail());
			        response.setPhoneNumber(user.getPhoneNumber());
			        response.setRole(user.getRole());
			        response.setMsg("Customer data");
			        
			        return response;
			        
		}).collect(Collectors.toList());
		
		
		return new ResponseEntity<>(responseList, HttpStatus.OK);
		
	}
	
	
	@GetMapping("/users")
	public ResponseEntity<List<AuthResponse>> fetchAllUsers(){
		
	List<User> 	users = userService.getAllUsers();
	
	List<AuthResponse> responseList  =  users.stream().map((user)->{
		
		AuthResponse response = new AuthResponse();
		response.setUserId(user.getUserId());
		response.setUsername(user.getUsername());
		response.setEmail(user.getEmail());
		response.setPhoneNumber(user.getPhoneNumber());
		response.setRole(user.getRole());
		response.setMsg("Data fetched Successfuly!");
		
		return response;
	}).collect(Collectors.toList());
	
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
