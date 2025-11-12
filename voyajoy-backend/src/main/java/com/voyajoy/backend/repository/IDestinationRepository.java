package com.voyajoy.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.voyajoy.backend.entity.Destination;

public interface IDestinationRepository extends JpaRepository<Destination,Long>{
	
	Boolean existsByDestinationName(String destinationName);
	Optional<Destination> findByDestinationName(String destinationName);
	List<Destination> findByLocation(String location);
	
	/*@Query(value="SELECT d FROM Destination d WHERE d.budget BETWEEN :minBdget  AND :maxBudget")
	List<Destination> findByBudgetRange(Double minBudget , Double maxBudget);*/
	
	List<Destination> findByTotalBudgetBetween(Double minBudget, Double maxBudget);
}
