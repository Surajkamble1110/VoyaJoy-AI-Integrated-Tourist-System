package com.voyajoy.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.voyajoy.backend.dto.BookingRequest;
import com.voyajoy.backend.entity.Booking;
import com.voyajoy.backend.entity.Destination;
import com.voyajoy.backend.entity.User;
import com.voyajoy.backend.exception.InvalidInputException;
import com.voyajoy.backend.exception.ResourceNotFoundException;
import com.voyajoy.backend.repository.IBookingRepository;
import com.voyajoy.backend.repository.IDestinationRepository;
import com.voyajoy.backend.repository.IUserRepository;

@Service
public class BookingService implements IBookingService {

	
	private final IBookingRepository bookingRepository;
	private final IUserService userService;
	private final IDestinationService destinationService;
	private final IUserRepository userRepository;
	private final IDestinationRepository destinationRepository;



	public BookingService(IBookingRepository bookingRepository,
			             IUserService userService, 
			             IDestinationService destinationService,
			             IUserRepository userRepository,
			             IDestinationRepository destinationRepository) {
		
		this.bookingRepository = bookingRepository;
		this.userService= userService;
		this.destinationService = destinationService;
		this.userRepository = userRepository;
	    this.destinationRepository = destinationRepository;
	}

	@Override
	public Booking createBooking(Long userId, Long destinationId, BookingRequest request) {
		
		User user = userService.getUserById(userId);
		Destination destination  = destinationService.getDestinationById(destinationId);
		
		Booking booking = new Booking();
		booking.setUser(user);
		booking.setDestination(destination);
		booking.setTravelDate(request.getTravelDate());
		booking.setTotalTravelers(request.getTotalTravelers());
		Double totalCost =  destination.getTotalBudget()* request.getTotalTravelers();
		booking.setTotalAmount(totalCost);
		booking.setAdvancePaid(false);
		booking.setSpecialRequest(request.getSpecialRequest());
		booking.setBookingStatus("PENDING");
		
		return bookingRepository.save(booking);

	}
	
	  public List<Booking> getAllBookingsOfUser(Long userId){
		
		if(!(userRepository.existsById(userId))) {
		    throw new ResourceNotFoundException("User Id not found: " + userId);
		}
		
	     return  bookingRepository.findByUserUserId(userId);		
		
	}
	
	  public Booking getBookingDetailsById(Long bookingId) {
		  
		 return  bookingRepository.findById(bookingId)
		.orElseThrow(()-> new ResourceNotFoundException("Booking-Id not found: " + bookingId));
		  		  
	  }

	@Override
	public Booking updateBookingStatus(Long bookingId, String newStatus) {
		
	Booking booking	= bookingRepository.findById(bookingId)
			.orElseThrow(()->new ResourceNotFoundException("Booking-Id not found: " + bookingId));
	
	      
	booking.setBookingStatus(newStatus);
	
	if(newStatus.equals("CONFIRMED")) {
		
		booking.setAdvancePaid(true);
	}
	
		return bookingRepository.save(booking);
   }
	
	@Override
	public List<Booking> getAllBookings() {
		
		return bookingRepository.findAll();
	}

	@Override
	public List<Booking> getBookingByStatus(String status) {
		
		return bookingRepository.findByBookingStatus(status);
		
	}

	@Override
	public List<Booking> getBookingsByDestination(Long destinationId) {
		
		if(!(destinationRepository.existsById(destinationId))) {
			
			throw new ResourceNotFoundException("Destination-Id not found: " + destinationId);
		}
		
		 return bookingRepository.findByDestinationDestinationId(destinationId);
	}

	
	@Override
	public void deleteBooking(Long bookingId) {
		
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(()-> new ResourceNotFoundException("Booking not found with Id: " + bookingId));
		
		if(booking.getBookingStatus().equals("CONFIRMED")) {
			
			throw new InvalidInputException(
			"Cannot cancel Confirmed booking only Pending booking can be cancel!");
			
		}
		
		booking.setBookingStatus("CANCELLED");
		bookingRepository.save(booking);
		
	}

	@Override
	public Long getTotalBookingsCount() {

		return bookingRepository.count();
	}

	@Override
	public Long getPendingBookingsCount() {
		
		return bookingRepository.countByBookingStatus("PENDING");
	}
	  
}
