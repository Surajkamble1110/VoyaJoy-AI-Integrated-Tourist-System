package com.voyajoy.backend.controller;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.voyajoy.backend.dto.DestinationRequest;
import com.voyajoy.backend.dto.DestinationResponse;
import com.voyajoy.backend.entity.Destination;
import com.voyajoy.backend.service.IDestinationService;

@RequestMapping("/voyajoy/api/destination")
@RestController
public class DestinationController {

	private final IDestinationService destinationService;

	public DestinationController(IDestinationService destinationService) {

		this.destinationService = destinationService;
	}

	@PreAuthorize("hasRole('MANAGER')")
	@PostMapping("/add-destination")
	public ResponseEntity<DestinationResponse> setDestination(@RequestBody DestinationRequest request) {

		Destination destination = destinationService.addDestination(request);

		DestinationResponse response = new DestinationResponse(

				destination.getDestinationId(), destination.getDestinationName(), destination.getLocation(),
				destination.getDescription(), destination.getTotalBudget(), destination.getAdvancePayment(),
				destination.getImage(), destination.getItinerary(), destination.getCreatedAt(),
				destination.getUpdatedAt(), "Destination stored succesfully");

		return new ResponseEntity<>(response, HttpStatus.CREATED);

	}

	@GetMapping("/all-destinations")
	public ResponseEntity<List<DestinationResponse>> fetchAllDestinations() {

		List<Destination> destinations = destinationService.getAllDestinations();

		List<DestinationResponse> responseList = destinations.stream().map(destination -> {

			return new DestinationResponse(

					destination.getDestinationId(), destination.getDestinationName(), destination.getLocation(),
					destination.getDescription(), destination.getTotalBudget(), destination.getAdvancePayment(),
					destination.getImage(), destination.getItinerary(), destination.getCreatedAt(),
					destination.getUpdatedAt(), "Destinations found Successfully"

			);

		}).collect(Collectors.toList());

		return new ResponseEntity<>(responseList, HttpStatus.OK);

	}

	@GetMapping("/profile/{id}")
	public ResponseEntity<DestinationResponse> fetchDestinationById(@PathVariable Long id) {

		Destination destination = destinationService.getDestinationById(id);

		DestinationResponse response = new DestinationResponse(

				destination.getDestinationId(), destination.getDestinationName(), destination.getLocation(),
				destination.getDescription(), destination.getTotalBudget(), destination.getAdvancePayment(),
				destination.getImage(), destination.getItinerary(), destination.getCreatedAt(),
				destination.getUpdatedAt(), "Destination found succesfully");

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	 @PreAuthorize("hasRole('MANAGER')")
	@PutMapping("/update-destination/{id}")
	public ResponseEntity<DestinationResponse> modifyDestination(@PathVariable Long id,
			@RequestBody DestinationRequest request) {

		Destination destination = destinationService.updateDestination(id, request);

		DestinationResponse response = new DestinationResponse(

				destination.getDestinationId(), destination.getDestinationName(), destination.getLocation(),
			destination.getDescription(), destination.getTotalBudget(), destination.getAdvancePayment(),
				destination.getImage(), destination.getItinerary(), destination.getCreatedAt(),
				destination.getUpdatedAt(), "Destination found succesfully");

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@PreAuthorize("hasRole('MANAGER')") 
	@DeleteMapping("/delete-destination/{id}")
	public ResponseEntity<String> removeDestination(@PathVariable Long id) {

		destinationService.deleteDestination(id);

		String response = "Destination removed Succesfully";

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@GetMapping("/by-name/{name}")
	public ResponseEntity<DestinationResponse> getDestinationByName(@PathVariable String name) {

		Destination destination = destinationService.searchDestinationByName(name);

		DestinationResponse response = new DestinationResponse(destination.getDestinationId(),
				destination.getDestinationName(), destination.getLocation(), destination.getDescription(),
				destination.getTotalBudget(), destination.getAdvancePayment(), destination.getImage(),
				destination.getItinerary(), destination.getCreatedAt(), destination.getUpdatedAt(),
				"Destination found succesfully");

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@GetMapping("/by-location/{location}")
	public ResponseEntity<List<DestinationResponse>> destinationsInSpecificLocation(@PathVariable String location) {

		List<Destination> destinations = destinationService.getAllDestinationsInSpecificLocation(location);

	List<DestinationResponse> responseList =	destinations.stream().map(destination -> {

			return new DestinationResponse(destination.getDestinationId(), destination.getDestinationName(),
					destination.getLocation(), destination.getDescription(), destination.getTotalBudget(),
					destination.getAdvancePayment(), destination.getImage(), destination.getItinerary(),
					destination.getCreatedAt(), destination.getUpdatedAt(), "Destination found Succssfully");

		}).collect(Collectors.toList());

		return new ResponseEntity<>(responseList, HttpStatus.OK);

	}
	
	
	@GetMapping("/by-range/{min-range}/{max-range}")
	public ResponseEntity<List<DestinationResponse>> destinationsByRange(
			@PathVariable("min-range") Double minRange, 
			@PathVariable("max-range") Double maxRange) {

		List<Destination> destinations = destinationService
				.getAllDestinationsWithinBudgetRange(minRange, maxRange);

	List<DestinationResponse> responseList =	destinations.stream()
			.map(destination -> {

			return new DestinationResponse(
					
					destination.getDestinationId(),
					destination.getDestinationName(),
					destination.getLocation(), 
					destination.getDescription(), 
					destination.getTotalBudget(),
					destination.getAdvancePayment(), 
					destination.getImage(), 
					destination.getItinerary(),
					destination.getCreatedAt(), 
					destination.getUpdatedAt(), 
					"Destination found Succssfully"
					
				);

		}).collect(Collectors.toList());

		return new ResponseEntity<>(responseList, HttpStatus.OK);

	}
			
}
