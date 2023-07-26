package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoReviewsFoundException;
import com.altnative.Alt.Native.Exceptions.ReviewNotFoundException;
import com.altnative.Alt.Native.Model.Review;
import com.altnative.Alt.Native.Service.ReviewService;
import com.amazonaws.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/review")
    public ResponseEntity<?> createReview(@Valid @RequestBody Review review) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/reviews/createReview").toUriString());
        return ResponseEntity.created(uri).body(reviewService.createReview(review));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> retrieveAllReview() {
        return ResponseEntity.ok().body(reviewService.retrieveAllReviews());
    }

    @GetMapping("/review/{id}")
    public ResponseEntity<?> retrieveReviewById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(reviewService.retrieveReviewById(id));
        } catch (ReviewNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/review/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok().body("Review with ID: " + id + " deleted successfully.");
        } catch (ReviewNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/users/reviewsById")
    public ResponseEntity<?> retrieveReviewsByUserId(@RequestParam Long id) {
        try {
            return ResponseEntity.ok().body(reviewService.retrieveReviewsByUserId(id));
        } catch (NoReviewsFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/users/reviewsByUsername")
    public ResponseEntity<?> retrieveReviewsByUsername(@RequestParam String username) {
        try {
            return ResponseEntity.ok().body(reviewService.retrieveReviewsByUsername(username));
        } catch (NoReviewsFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
