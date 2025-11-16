package com.voyajoy.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.voyajoy.backend.entity.Booking;

public interface IBookingRepository extends JpaRepository<Booking, Long>{

	List<Booking> findByUserUserId(Long userId);
	List<Booking> findByBookingStatus(String status);
	List<Booking> findByDestinationDestinationId(Long destinaionId);
	Long countByBookingStatus(String status);
}
