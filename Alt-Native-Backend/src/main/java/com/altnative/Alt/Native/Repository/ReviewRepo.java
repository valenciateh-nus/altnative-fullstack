package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepo extends JpaRepository<Review, Long> {

    List<Review> findByAppUserId(Long appUserId);
    List<Review> findByAppUserUsername(String username);
}