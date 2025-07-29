package com.carratings.car_ratings_backend.review;

import com.carratings.car_ratings_backend.car.Car;
import com.carratings.car_ratings_backend.rating.Rating;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long review_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id")
    @JsonBackReference
    private Car car;

    private String user_name;
    private String review_text;
    private LocalDateTime review_date = LocalDateTime.now();

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Rating> ratings = new ArrayList<>();

    // Getters and setters
    public Long getReview_id() { return review_id; }
    public void setReview_id(Long review_id) { this.review_id = review_id; }
    public Car getCar() { return car; }
    public void setCar(Car car) { this.car = car; }
    public String getUser_name() { return user_name; }
    public void setUser_name(String user_name) { this.user_name = user_name; }
    public String getReview_text() { return review_text; }
    public void setReview_text(String review_text) { this.review_text = review_text; }
    public LocalDateTime getReview_date() { return review_date; }
    public void setReview_date(LocalDateTime review_date) { this.review_date = review_date; }
    public List<Rating> getRatings() { return ratings; }
    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
        if (ratings != null) {
            for (Rating rating : this.ratings) {
                rating.setReview(this);
            }
        }
    }
}
