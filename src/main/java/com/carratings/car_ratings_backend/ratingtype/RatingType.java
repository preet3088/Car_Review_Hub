package com.carratings.car_ratings_backend.ratingtype;

import jakarta.persistence.*;

@Entity
@Table(name = "rating_types")
public class RatingType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_type_id") // Maps to the correct column name
    private Long rating_type_id;

    @Column(name = "name") // Maps to the correct column name
    private String name;

    // Getters and Setters
    public Long getRating_type_id() { return rating_type_id; }
    public void setRating_type_id(Long rating_type_id) { this.rating_type_id = rating_type_id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
