package com.voyajoy.backend.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.voyajoy.backend.dto.BookingResponse;
import com.voyajoy.backend.entity.Booking;

public class BookingMapper {

	public static BookingResponse toResponse(Booking booking) {

		return new BookingResponse(

				 booking.getBookingId(),
		            booking.getBookingDate(),
		            booking.getTravelDate(),
		            booking.getTotalTravelers(),
		            booking.getTotalAmount(),
		            booking.getAdvancePaid(),
		            booking.getDestination().getAdvancePayment()*booking.getTotalTravelers(),
		            booking.getSpecialRequest(),
		            booking.getBookingStatus(),
		            booking.getUser().getUserId(),
		            booking.getUser().getUsername(),
		            booking.getDestination().getDestinationId(),
		            booking.getDestination().getDestinationName(),
		            booking.getCreatedAt(),
		            booking.getUpdatedAt(),
		            "Booking created Successfully"
				
				);
	}
	
	
	public static List<BookingResponse> toResponseList(List<Booking> bookings){
		
		return bookings.stream().map(BookingMapper :: toResponse)
				.collect(Collectors.toList());
		
	}
}
