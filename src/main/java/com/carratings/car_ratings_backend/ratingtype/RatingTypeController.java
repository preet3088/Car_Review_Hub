package com.carratings.car_ratings_backend.ratingtype;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rating-types")
public class RatingTypeController {

    private final RatingTypeRepository ratingTypeRepository;

    public RatingTypeController(RatingTypeRepository ratingTypeRepository) {
        this.ratingTypeRepository = ratingTypeRepository;
    }

    // --- METHODS MOVED OUTSIDE THE CONSTRUCTOR ---

    @GetMapping
    public List<RatingType> getAllRatingTypes() {
        return ratingTypeRepository.findAll();
    }

    @PostMapping
    public RatingType addRatingType(@RequestBody RatingType ratingType) {
        return ratingTypeRepository.save(ratingType);
    }
}
