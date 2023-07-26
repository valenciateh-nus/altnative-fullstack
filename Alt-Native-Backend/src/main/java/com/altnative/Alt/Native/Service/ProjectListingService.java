package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.ProjectListing;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProjectListingService {

    ProjectListing createProjectListing(Long cId, ProjectListing projectListing, List<MultipartFile> files) throws UsernameNotFoundException, RefashionerNotFoundException, CategoryNotFoundException, InvalidFileException, S3Exception, ImageCannotBeEmptyException;

    List<ProjectListing> retrieveProjectListingsByRefashionerId(Long refashionerId) throws ProjectListingNotFoundException, NotARefashionerException;

    void addImageToProjectListing(Long projectListingId, MultipartFile file) throws ProjectListingNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException;

    void removeImageFromProjectListing(Long projectListingId, Long imageId) throws ProjectListingNotFoundException, NoAccessRightsException;

    List<ProjectListing> retrieveAllProjectListings() throws NoAccessRightsException;

    List<ProjectListing> retrieveAvailableProjectListings() throws ProjectListingNotFoundException;

    ProjectListing retrieveProjectListingById(Long id) throws ProjectListingNotFoundException;

    ProjectListing updateProjectListing(ProjectListing newProjectListing) throws ProjectListingNotFoundException, NoAccessRightsException;

    void deleteProjectListing(Long id) throws ProjectListingNotFoundException, NoAccessRightsException;

    List<ProjectListing> searchOwnProjectListings(Optional<Long[]> cIds, Optional<String> keyword) throws ProjectListingNotFoundException;

    List<ProjectListing> retrieveOwnProjectListings() throws ProjectListingNotFoundException;

    List<ProjectListing> searchProjectListings(Optional<Long[]> cIds, Optional<String> keyword) throws ProjectListingNotFoundException;

    List<ProjectListing> searchProjectListings2(Optional<Long[]> cIds, Optional<String> keyword) throws ProjectListingNotFoundException;

    List<ProjectListing> searchAllProjectListings(Optional<Long[]> cIds, Optional<String> keyword);

    void favouriteProjectListing(Long id) throws ProjectListingNotFoundException, ProjectListingAlreadyFavouritedException;

    void unfavouriteProjectListing(Long id) throws ProjectListingNotFoundException, FavouriteNotFoundException;

    List<ProjectListing> retrieveFavouritedProjectListings();

    List<ProjectListing> searchProjectListingsByUser(String username, Optional<String> keyword);

    List<ProjectListing> retrieveProjectListingsByUsername(String username);

}
