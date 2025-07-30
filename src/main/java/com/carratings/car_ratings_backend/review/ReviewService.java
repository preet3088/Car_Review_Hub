package com.carratings.car_ratings_backend.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.carratings.car_ratings_backend.car.Car;
import com.carratings.car_ratings_backend.car.CarRepository;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private CarRepository carRepository;
    
    @Transactional
    public Review saveReview(Review review) {
        // Save the review first
        Review savedReview = reviewRepository.save(review);
        
        // Recalculate and update the car's average rating
        updateCarAverageRating(review.getCar().getCar_id());
        
        return savedReview;
    }
    
    private void updateCarAverageRating(Long carId) {
        // Calculate the new average rating for this car
        Double averageRating = reviewRepository.findAverageRatingByCarId(carId);
        
        // Update the car's average_rating field
        Car car = carRepository.findById(carId).orElse(null);
        if (car != null) {
            car.setAverage_rating(averageRating != null ? averageRating.floatValue() : 0.0f);
            carRepository.save(car);
        }
    }
}
