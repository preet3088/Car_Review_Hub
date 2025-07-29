package com.carratings.car_ratings_backend.car;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity; // <-- Add this import if it's missing

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarRepository carRepository;

    public CarController(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @GetMapping
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    // --- THIS IS THE NEW METHOD TO ADD ---
    // This endpoint handles requests for a single car by its ID.
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        return carRepository.findById(id)
                .map(ResponseEntity::ok) // If found, return 200 OK with the car
                .orElse(ResponseEntity.notFound().build()); // If not found, return 404 Not Found
    }
    // --- END OF NEW METHOD ---

    @PostMapping
    public Car addCar(@RequestBody Car car) {
        return carRepository.save(car);
    }

    @PutMapping("/{id}")
    public Car updateCar(@PathVariable Long id, @RequestBody Car carDetails) {
        carDetails.setCar_id(id); // Ensure the ID is set for the update
        return carRepository.save(carDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        carRepository.deleteById(id);
    }
}
