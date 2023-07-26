package com.altnative.Alt.Native.Service.socialmedia;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Post;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {
    Post createPost(Post post, List<MultipartFile> files) throws InvalidFileException, S3Exception, ImageCannotBeEmptyException;

    Post retrievePostById(Long id) throws PostNotFoundException;

    void addImageToPost(Long postId, MultipartFile file) throws PostNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException;

    void removeImageFromPost(Long postId, Long imageId) throws PostNotFoundException, NoAccessRightsException;

    List<Post> retrieveAllPosts();

    Post updatePost(Long id, Post newPost) throws PostNotFoundException, NoAccessRightsException;

    void deletePost(Long id) throws PostNotFoundException, NoAccessRightsException;
}
