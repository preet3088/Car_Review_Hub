package com.carratings.car_ratings_backend.review;

import com.carratings.car_ratings_backend.ratingtype.RatingTypeRepository;
import org.springframework.security.core.Authentication; // Make sure this import is present
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final RatingTypeRepository ratingTypeRepository;

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
        
        // --- THIS IS THE FIX ---
        // Use the correct method name 'setUser_name' from your Review.java file
        if (authentication != null && authentication.isAuthenticated()) {
            review.setUser_name(authentication.getName());
        }

        return reviewRepository.save(review);
    }
}
