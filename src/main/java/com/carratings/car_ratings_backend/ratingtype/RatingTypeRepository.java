package com.carratings.car_ratings_backend.ratingtype;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
// --- ADDED <RatingType, Long> TO FIX THE REPOSITORY ---
public interface RatingTypeRepository extends JpaRepository<RatingType, Long> {

    // This method is now correctly defined within the interface
    Optional<RatingType> findByName(String name);
}
