package com.voyajoy.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@Table(name="Booking")
@Data
@Entity
public class Booking {
	
	
	@Column(name="bid", unique= true, nullable=false)
	@Id	
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long bookingId;
	
	@Column(name="Booking_Date", nullable=false, updatable=false)
	private LocalDateTime bookingDate;
	
	@Column(name="Travel_Date", nullable=false)
	private LocalDate travelDate;
	
	@Column(name="Total_Travelers",  nullable=false)
	private Integer totalTravelers;
	
	@Column(name="Total_Amount", nullable=false)
	private Double totalAmount;
	
	@Column(name="Advance_Paid", nullable=false)
	private Boolean advancePaid;
	
	@Column(name="Special_Request", columnDefinition="Text")
	private String specialRequest;
	
	@Column(name="Booking_Status", nullable=false)
	private String bookingStatus;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="user_Id", referencedColumnName="uid", nullable=false)
	private User user;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="destination_Id", referencedColumnName="did", nullable=false)
	private Destination destination;
	
	
	@Column(name="Created_At", nullable=false, updatable=false)
	private LocalDateTime createdAt;
	
	@Column(name="Updated_At", nullable=false, updatable=true)
	private LocalDateTime updatedAt;
	
    @PrePersist
    public void onCreate() {
    	
    	this.createdAt = LocalDateTime.now();
    	this.updatedAt=LocalDateTime.now();
    	this.bookingDate=LocalDateTime.now();
    }
    
    @PreUpdate
    public void onUpdate() {
    	
    	this.updatedAt = LocalDateTime.now();
    }
}
