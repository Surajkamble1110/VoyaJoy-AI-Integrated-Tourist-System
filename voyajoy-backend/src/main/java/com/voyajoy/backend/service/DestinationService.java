package com.voyajoy.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.voyajoy.backend.dto.DestinationRequest;
import com.voyajoy.backend.entity.Destination;
import com.voyajoy.backend.repository.IDestinationRepository;

@Service
public class DestinationService implements IDestinationService{

	
	private final IDestinationRepository destinationRepository;
	
	public DestinationService(IDestinationRepository destinationRepository) {
		
		this.destinationRepository = destinationRepository;
		
	}

	@Override
	public Destination addDestination(DestinationRequest request) {
		
		if(destinationRepository.existsByDestinationName(request.getDestinationName())){
			
			throw new RuntimeException("Destination already exsists!");
		}
		
		Destination destination = new Destination();
		destination.setDestinationName(request.getDestinationName());
		destination.setLocation(request.getLocation());
		destination.setDescription(request.getDescription());
		destination.setTotalBudget(request.getTotalBudget());
		destination.setAdvancePayment(request.getAdvancePayment());
		destination.setImage(request.getImage());
		destination.setItinerary(request.getItinerary());
		
		return destinationRepository.save(destination);
		
	}

	@Override
	public List<Destination> getAllDestinations() {
		
		
		return destinationRepository.findAll();
	}

	@Override
	public Destination getDestinationById(Long id) {
		
		return destinationRepository.findById(id).orElseThrow(()-> new RuntimeException("Destionation not found"));
		
	}

	@Override
	public Destination updateDestination(Long id, DestinationRequest request) {
		
	Destination destination =destinationRepository.findById(id).orElseThrow(()-> new RuntimeException("Destionation not found"));
	 
	
	destination.setDestinationName(request.getDestinationName());
	destination.setLocation(request.getLocation());
	destination.setDescription(request.getDescription());
	destination.setTotalBudget(request.getTotalBudget());
	destination.setAdvancePayment(request.getAdvancePayment());
	destination.setImage(request.getImage());
	destination.setItinerary(request.getItinerary());
	
	  return destinationRepository.save(destination);
	
	}
	
	
	@Override
	public void deleteDestination(Long destinationId) {
	
		Destination destination =  destinationRepository.findById(destinationId)
				 .orElseThrow(()-> new RuntimeException("Destination not found"));
		 
		 
		destinationRepository.delete(destination);	 
		 
		
	}
	
	
	@Override
	public Destination searchDestinationByName(String destinationName) {

			
			return destinationRepository.findByDestinationName(destinationName)
		    .orElseThrow(()-> new RuntimeException("Destination not found!"));
		
	}

	@Override
	public List<Destination> getAllDestinationsInSpecificLocation(String location) {
		
		return destinationRepository.findByLocation(location);
	}

	@Override
	public List<Destination> getAllDestinationsWithinBudgetRange(Double minBudget, Double maxBudget) {
		
		return destinationRepository.findByTotalBudgetBetween(minBudget, maxBudget);
	}

	@Override
	public Long getTotalDestinationsCount() {
		return destinationRepository.count();
	}
	
}
