package com.altnative.Alt.Native.Service.socialmedia;

import com.altnative.Alt.Native.Exceptions.CommentNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.PostNotFoundException;
import com.altnative.Alt.Native.Model.Comment;

import java.util.List;

public interface CommentService {

    Comment createComment(Long id, Comment comment) throws PostNotFoundException;

    Comment retrieveCommentById(Long id) throws CommentNotFoundException;

    List<Comment> retrieveCommentsByPostId(Long id);

    Comment updateComment(Long id, Comment newComment) throws CommentNotFoundException, NoAccessRightsException;

    void deleteComment(Long id) throws CommentNotFoundException, NoAccessRightsException;
}
