package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.PostNotFoundException;
import com.altnative.Alt.Native.Model.Post;
import com.altnative.Alt.Native.Service.socialmedia.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;

    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@Valid @RequestPart Post post, @RequestPart(value="files", required=false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/posts").toUriString());
        try {
            return ResponseEntity.created(uri).body(postService.createPost(post, files));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/posts/image/{id}")
    public ResponseEntity<?> addImageToPost(@PathVariable Long postId, @RequestPart(value="file", required=true) MultipartFile file) {
        try {
            postService.addImageToPost(postId, file);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/posts/{postId}/image/{imageId}")
    public ResponseEntity<?> removeImageFromPost(@PathVariable Long postId, @PathVariable Long imageId) {
        try {
            postService.removeImageFromPost(postId, imageId);
            return ResponseEntity.ok().build();
        } catch (NoAccessRightsException | PostNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @Valid @RequestBody Post post) {
        try {
            return ResponseEntity.ok().body(postService.updatePost(id, post));
        } catch (PostNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> retrieveAllPosts() {
        return ResponseEntity.ok().body(postService.retrieveAllPosts());
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<?> retrievePostById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(postService.retrievePostById(id));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.ok().body("Post with ID: " + id + " deleted successfully.");
        } catch (PostNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
