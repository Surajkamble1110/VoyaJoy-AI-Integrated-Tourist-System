package com.voyajoy.backend.service;

import java.util.List;

import com.voyajoy.backend.dto.BookingRequest;
import com.voyajoy.backend.entity.Booking;

public interface IBookingService {
	
	Booking createBooking(Long userId, Long destinationId, BookingRequest request);
	List<Booking> getAllBookingsOfUser(Long userId);
	Booking getBookingDetailsById(Long bookingId);
	Booking updateBookingStatus(Long bookingId, String newStatus);
	List<Booking> getAllBookings();
	List<Booking> getBookingByStatus(String status);
	List<Booking> getBookingsByDestination(Long destinationId);
	void deleteBooking(Long bookingId);
	Long getTotalBookingsCount();
	Long getPendingBookingsCount();


}
