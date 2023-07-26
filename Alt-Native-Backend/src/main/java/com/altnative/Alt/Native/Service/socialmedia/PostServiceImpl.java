package com.altnative.Alt.Native.Service.socialmedia;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.PostRepo;
import com.altnative.Alt.Native.Service.AppUserService;
import com.altnative.Alt.Native.Service.ImageService;
import com.altnative.Alt.Native.Service.UserService;
import com.amazonaws.services.ecr.model.ImageNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PostServiceImpl implements PostService {
    private final PostRepo postRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final ImageService imageService;

    @Override
    public Post createPost(Post post, List<MultipartFile> files) throws InvalidFileException, S3Exception, ImageCannotBeEmptyException {
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
        if (files != null) {
            post.setImageList(new ArrayList<Image>());

            for (int i = 0; i < files.size(); i++) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), appUser.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, files.get(i));
                post.getImageList().add(newImage);
            }
        }
        post.setUser(appUser);
        post.setDateCreated(new Date());
        Post post1 = postRepo.save(post);
        return post1;
    }

    @Override
    public Post retrievePostById(Long id) throws PostNotFoundException {
        Optional<Post> exists = postRepo.findById(id);
        if (exists.isEmpty()) {
            throw new PostNotFoundException("Post id: " + id + " does not exist.");
        } else {
            Post post = exists.get();
            return post;
        }
    }

    @Override
    public List<Post> retrieveAllPosts() {
        return postRepo.findAll();
    }

    @Override
    public void addImageToPost(Long postId, MultipartFile file) throws PostNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Post> exists = postRepo.findById(postId);
        if (exists.isEmpty()) {
            throw new PostNotFoundException("Post id: " + postId + " does not exist.");
        } else {
            Post post = exists.get();
            if (post.getUser().getUsername().equals(user.getUsername()) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, file);
                post.getImageList().add(newImage);
                postRepo.save(post);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public void removeImageFromPost(Long postId, Long imageId) throws PostNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Post> exists = postRepo.findById(postId);
        if (exists.isEmpty()) {
            throw new PostNotFoundException("Post id: " + postId + " does not exist.");
        } else {
            Post post = exists.get();
            if (post.getUser().getUsername().equals(user.getUsername()) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                List<Image> postImages = post.getImageList();
                boolean found = false;
                for (Image image : postImages) {
                    log.info("current image id" + image.getId() + " while the inserted id is " + imageId);
                    if (image.getId() == imageId || image.getId().equals(imageId)) {
                        found = true;
                        postImages.remove(image);
                        imageService.deleteImage(image);
                        break;
                    }
                }
                if (!found) { //not found
                    throw new ImageNotFoundException("Post does not contain this image!");
                }
                post.setImageList(postImages);
                postRepo.save(post);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        }
    }

    @Override
    public Post updatePost(Long id, Post newPost) throws PostNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Post> post = postRepo.findById(id);
        if (post.isEmpty()) {
            throw new PostNotFoundException("Post with id: " + id + " not found!");
        } else {
            Post postToUpdate = post.get();
            if (user.getRoles().contains(Role.valueOf("ADMIN")) || postToUpdate.getUser().getUsername().equals(user.getUsername())) {
                postToUpdate.setTitle(newPost.getTitle());
                postToUpdate.setDescription(newPost.getDescription());
                postToUpdate.setContent(newPost.getContent());
                postToUpdate.setDateCreated(new Date());

                postRepo.save(postToUpdate);
                return postToUpdate;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public void deletePost(Long id) throws PostNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Post> post = postRepo.findById(id);
        if (post.isEmpty()) {
            throw new PostNotFoundException("Post with id: " + id + " not found!");
        } else {
            Post postToDelete = post.get();
            if (user.getRoles().contains(Role.valueOf("ADMIN")) || postToDelete.getUser().getUsername().equals(user.getUsername())) {
                postRepo.delete(postToDelete);
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }
}

