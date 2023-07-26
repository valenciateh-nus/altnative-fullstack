package com.altnative.Alt.Native.Service.socialmedia;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.CommentNotFoundException;
import com.altnative.Alt.Native.Exceptions.PostNotFoundException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.Comment;
import com.altnative.Alt.Native.Model.Post;
import com.altnative.Alt.Native.Repository.CommentRepo;
import com.altnative.Alt.Native.Service.AppUserService;
import com.altnative.Alt.Native.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CommentServiceImpl implements CommentService {
    private final CommentRepo commentRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final PostService postService;

    @Override
    public Comment createComment(Long id, Comment comment) throws PostNotFoundException {
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
        Post post = postService.retrievePostById(id);
        comment.setPost(post);
        comment.setUser(appUser);
        comment.setDateCreated(new Date());
        Comment comment1 = commentRepo.save(comment);
        post.getComments().add(comment1);

        return comment1;
    }

    @Override
    public Comment retrieveCommentById(Long id) throws CommentNotFoundException {
        Optional<Comment> exists = commentRepo.findById(id);
        if (exists.isEmpty()) {
            throw new CommentNotFoundException("Comment id: " + id + " does not exist.");
        } else {
            Comment comment = exists.get();
            return comment;
        }
    }

    @Override
    public List<Comment> retrieveCommentsByPostId(Long id) {
        return commentRepo.findByPostId(id);
    }

    @Override
    public Comment updateComment(Long id, Comment newComment) throws CommentNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Comment> comment = commentRepo.findById(id);
        if (comment.isEmpty()) {
            throw new CommentNotFoundException("Comment with id: " + id + " not found!");
        } else {
            Comment commentToUpdate = comment.get();
            if (user.getRoles().contains(Role.valueOf("ADMIN")) || commentToUpdate.getUser().getUsername().equals(user.getUsername())) {
                commentToUpdate.setBody(newComment.getBody());
                commentToUpdate.setDateCreated(new Date());
                commentRepo.save(commentToUpdate);
                return commentToUpdate;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public void deleteComment(Long id) throws CommentNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Comment> comment = commentRepo.findById(id);
        if (comment.isEmpty()) {
            throw new CommentNotFoundException("Comment with id: " + id + " not found!");
        } else {
            Comment commentToDelete = comment.get();
            if (user.getRoles().contains(Role.valueOf("ADMIN")) || commentToDelete.getUser().getUsername().equals(user.getUsername())) {
                commentRepo.delete(commentToDelete);
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }
}

