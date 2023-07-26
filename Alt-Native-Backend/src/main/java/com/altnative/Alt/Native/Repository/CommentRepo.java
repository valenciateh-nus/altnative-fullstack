package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Comment;
import com.altnative.Alt.Native.Model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepo extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long id);

}
