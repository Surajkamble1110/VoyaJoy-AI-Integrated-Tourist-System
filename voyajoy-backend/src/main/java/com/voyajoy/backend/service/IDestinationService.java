package com.voyajoy.backend.service;

import java.util.List;

import com.voyajoy.backend.dto.DestinationRequest;
import com.voyajoy.backend.entity.Destination;

public interface IDestinationService {
	
	Destination addDestination(DestinationRequest request);
	List<Destination> getAllDestinations();
	Destination getDestinationById(Long id);
	Destination updateDestination(Long id, DestinationRequest request);
	void deleteDestination(Long destinationId);
	Destination searchDestinationByName(String destinationName);
	List<Destination> getAllDestinationsInSpecificLocation(String location);
	List<Destination> getAllDestinationsWithinBudgetRange(Double minBudget, Double maxBudget);
	Long getTotalDestinationsCount();
}
