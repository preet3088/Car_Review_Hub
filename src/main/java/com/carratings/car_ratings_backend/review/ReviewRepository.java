package com.carratings.car_ratings_backend.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    @Query("SELECT AVG(CAST(r.rating_value AS DOUBLE)) FROM Rating r WHERE r.review.review_id IN (SELECT rev.review_id FROM Review rev WHERE rev.car.car_id = :carId)")
    Double findAverageRatingByCarId(@Param("carId") Long carId);
}
