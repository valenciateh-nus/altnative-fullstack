package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Exceptions.ReviewNotFoundException;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.AppUserRepo;
import com.altnative.Alt.Native.Repository.ReviewRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepo reviewRepo;
    private final AppUserRepo appUserRepo;
    private final AppUserService appUserService;
    private final UserService userService;

    @Override
    public Review createReview(@Valid Review review) throws UsernameNotFoundException {

        AppUser evaluatedUser = appUserService.getUser(review.getAppUser().getUsername());
        AppUser owner = appUserService.getUser(userService.getCurrentUsername());

        if (evaluatedUser.getReviews() == null) {
            evaluatedUser.setReviews(new ArrayList<>());
        }
        review.setOwner(owner);
        evaluatedUser.getReviews().add(review);
        reviewRepo.save(review);

        // update rating of evaluated user
        List<Review> reviews = reviewRepo.findByAppUserId(evaluatedUser.getId());
        Double currRating = evaluatedUser.getRating();
        Double updatedRating = currRating + (review.getReviewRating()-currRating)/(reviews.size());
        updatedRating = (double) Math.round(updatedRating * 10.0) / 10.0;
        evaluatedUser.setRating(updatedRating);
        appUserRepo.save(evaluatedUser);

        // review entity to DB
        log.info("Saving new review {} to db", review.getDescription());

        return review;
    }

    @Override
    public Review retrieveReviewById(Long id) throws ReviewNotFoundException, NoAccessRightsException {
        Optional<Review> exists = reviewRepo.findById(id);
        if (exists.isEmpty()) {
            throw new ReviewNotFoundException("Review id: " + id + " does not exist.");
        } else {
            Review review = exists.get();
            return review;
        }
    }

    @Override
    public List<Review> retrieveAllReviews() {
        return reviewRepo.findAll();
    }

    @Override
    public Review updateReview(@Valid Review newReview) throws ReviewNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            Optional<Review> reviewOpt = reviewRepo.findById(newReview.getId());
            if (reviewOpt.isEmpty()) {
                throw new ReviewNotFoundException("Review with id: " + newReview.getId() + " not found!");
            } else {
                Review review = reviewOpt.get();
                review.setDescription(newReview.getDescription());
                review.setReviewRating(newReview.getReviewRating());
                review.setAppUser(newReview.getAppUser());
                review.setDateCreated(newReview.getDateCreated());

                reviewRepo.save(review);
                return review;
            }
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public void deleteReview(Long id) throws ReviewNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            Optional<Review> review = reviewRepo.findById(id);
            if (review.isEmpty()) {
                throw new ReviewNotFoundException("Review with id: " + id + " not found!");
            } else {
                Review reviewToDelete = review.get();

                reviewToDelete.getAppUser().getReviews().remove(reviewToDelete);
//                reviewRepo.findByAppUserUsername(userService.getCurrentUsername()).remove(reviewToDelete);
                AppUser reviewModifiedUser = reviewToDelete.getAppUser();
                List<Review> reviews = reviewModifiedUser.getReviews();
                if (reviews.isEmpty()) {
                    reviewModifiedUser.setRating(0.0);
                } else {
                    Double rating = 0.0;
                    for (Review r : reviews) {
                        rating += r.getReviewRating();
                    }
                    reviewModifiedUser.setRating(rating/reviews.size());
                }
                reviewRepo.delete(reviewToDelete);
                reviewRepo.flush();
            }
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public List<Review> retrieveReviewsByUserId(Long id) throws NoReviewsFoundException {
        List<Review> reviews = reviewRepo.findByAppUserId(id);

        if (reviews.isEmpty()) {
            throw new NoReviewsFoundException("There are no reviews under user with id: " + id + "!");
        } else {
            return reviews;
        }
    }

    @Override
    public List<Review> retrieveReviewsByUsername(String username) throws NoReviewsFoundException, UsernameNotFoundException {
        List<Review> reviews = reviewRepo.findByAppUserUsername(username);

        if (reviews.isEmpty()) {
            throw new NoReviewsFoundException("There are no reviews under user with username: " + username + "!");
        } else {
            return reviews;
        }
    }
}

