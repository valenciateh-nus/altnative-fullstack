package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepo extends JpaRepository<Post, Long> {

    List<Post> findByUserId(Long appUserId);

}
