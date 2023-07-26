package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoReviewsFoundException;
import com.altnative.Alt.Native.Exceptions.ReviewNotFoundException;
import com.altnative.Alt.Native.Model.Review;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface ReviewService {
    Review createReview(Review review);
    public List<Review> retrieveAllReviews();
    public Review retrieveReviewById(Long id) throws ReviewNotFoundException, NoAccessRightsException;
    public Review updateReview(Review newReview) throws ReviewNotFoundException, NoAccessRightsException;
    public void deleteReview(Long id) throws ReviewNotFoundException, NoAccessRightsException;
    List<Review> retrieveReviewsByUserId(Long id) throws NoReviewsFoundException;

    List<Review> retrieveReviewsByUsername(String username) throws NoReviewsFoundException, UsernameNotFoundException;
}