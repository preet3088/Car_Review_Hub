package com.carratings.car_ratings_backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    // Add this method to check if a user exists by username
    boolean existsByUsername(String username);
}
