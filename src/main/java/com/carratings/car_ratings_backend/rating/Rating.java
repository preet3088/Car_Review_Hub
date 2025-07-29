package com.carratings.car_ratings_backend.rating;

import com.carratings.car_ratings_backend.review.Review;
import com.carratings.car_ratings_backend.ratingtype.RatingType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rating_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    @JsonBackReference
    private Review review;

    @ManyToOne
    @JoinColumn(name = "rating_type_id")
    private RatingType ratingType;

    @JsonProperty("value")
    private int rating_value;

    // Getters and setters
    public Long getRating_id() { return rating_id; }
    public void setRating_id(Long rating_id) { this.rating_id = rating_id; }
    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }
    public RatingType getRatingType() { return ratingType; }
    public void setRatingType(RatingType ratingType) { this.ratingType = ratingType; }
    public int getRating_value() { return rating_value; }
    public void setRating_value(int rating_value) { this.rating_value = rating_value; }
}
