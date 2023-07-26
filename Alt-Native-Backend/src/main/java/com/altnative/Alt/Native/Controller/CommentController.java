package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.CommentNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Model.Comment;
import com.altnative.Alt.Native.Service.socialmedia.CommentService;
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
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<?> createComment(@PathVariable Long id, @Valid @RequestBody Comment comment) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/posts/{id}/comments").toUriString());
        try {
            return ResponseEntity.created(uri).body(commentService.createComment(id, comment));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @Valid @RequestBody Comment comment) {
        try {
            return ResponseEntity.ok().body(commentService.updateComment(id, comment));
        } catch (CommentNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok().body("Comment with ID: " + id + " deleted successfully.");
        } catch (CommentNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
