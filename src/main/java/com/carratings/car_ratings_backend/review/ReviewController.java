package com.carratings.car_ratings_backend.review;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carratings.car_ratings_backend.ratingtype.RatingTypeRepository;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final RatingTypeRepository ratingTypeRepository;
    
    @Autowired
    private ReviewService reviewService; // Add this service

    public ReviewController(ReviewRepository reviewRepository, RatingTypeRepository ratingTypeRepository) {
        this.reviewRepository = reviewRepository;
        this.ratingTypeRepository = ratingTypeRepository;
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping
    @Transactional
    public Review addReview(@RequestBody Review review, Authentication authentication) {
        // Process each rating to link it to a real database entry
        review.getRatings().forEach(rating -> {
            String ratingTypeName = rating.getRatingType().getName();
            ratingTypeRepository.findByName(ratingTypeName)
                .ifPresent(rating::setRatingType);
        });

        // Use the correct method name 'setUser_name' from your Review.java file
        if (authentication != null && authentication.isAuthenticated()) {
            review.setUser_name(authentication.getName());
        }

        // THIS IS THE KEY CHANGE: Use the service instead of direct repository save
        return reviewService.saveReview(review);
    }
}
