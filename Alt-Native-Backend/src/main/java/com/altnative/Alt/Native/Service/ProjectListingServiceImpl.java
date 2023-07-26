package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Exceptions.ProjectListingNotFoundException;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Model.ProjectListing;
import com.altnative.Alt.Native.Repository.*;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import com.amazonaws.services.ecr.model.ImageNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProjectListingServiceImpl implements ProjectListingService {
    private final ProjectListingRepo projectListingRepo;
    private final UserService userService;
    private final AppUserService appUserService;
    private final AppUserRepo appUserRepo;
    private final CategoryRepo categoryRepo;
    private final MaterialRepo materialRepo;
    private final TagRepo tagRepo;
    private final ImageService imageService;

    @Override
    public ProjectListing createProjectListing(Long cId, ProjectListing projectListing, List<MultipartFile> files) throws UsernameNotFoundException, RefashionerNotFoundException, CategoryNotFoundException, InvalidFileException, S3Exception, ImageCannotBeEmptyException {

        //check whether files is empty
        int size = files.size();
        if (size == 0) {
            throw new ImageCannotBeEmptyException("You must upload an image for a project listing!");
        }

        // retrieve logged in refashioner entity by id
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        // retrieve category entity by id
        Category category = categoryRepo.findById(cId).orElseThrow(
                () -> new CategoryNotFoundException("Category id: " + cId + " does not exist."));

        List<Material> materialList = new ArrayList<>();
        List<Tag> tagList = new ArrayList<>();
        if (projectListing.getMaterialList().size() != 0) {
            for (Material m : projectListing.getMaterialList()) {
                Material material = materialRepo.save(m);
                materialList.add(material);
            }
        }

        if (projectListing.getTagList().size() != 0) {
            for (Tag t : projectListing.getTagList()) {
                Tag tag = tagRepo.save(t);
                tagList.add(tag);
            }
        }

        // check if AppUser is a refashioner
        if (user.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
            if (files != null) {
                projectListing.setImageList(new ArrayList<Image>());

                for (int i = 0; i < files.size(); i++) {
                    String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                    String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                    Image newImage = new Image();
                    newImage.setPath(path);
                    newImage.setFileName(filename);
                    newImage = imageService.createImage(newImage, files.get(i));
                    projectListing.getImageList().add(newImage);
                }
            }

            projectListing.setTagList(tagList);
            projectListing.setMaterialList(materialList);
            projectListing.setProposedCompletionDate(new Date());
            projectListing.setRefashioner(user);
            projectListing.setCategory(category);
            user.getProjectListings().add(projectListing);
            category.getProjects().add(projectListing);
        } else {
            throw new RefashionerNotFoundException("User id: " + user.getId() + " is not a refashioner.");
        }

        // projectListing entity to DB
        log.info("Saving new projectListing {} to db", projectListing.getDescription());
        projectListingRepo.saveAndFlush(projectListing);
        return projectListing;
    }

    @Override
    public void addImageToProjectListing(Long projectListingId, MultipartFile file) throws ProjectListingNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Project> exists = projectListingRepo.findById(projectListingId);
        if (exists.isEmpty()) {
            throw new ProjectListingNotFoundException("ProjectListing id: " + projectListingId + " does not exist.");
        } else {
            ProjectListing projectListing = (ProjectListing) exists.get();
            if (user.getRoles().contains(Role.valueOf("USER_REFASHIONER")) && projectListing.getRefashioner().equals(user) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, file);
                projectListing.getImageList().add(newImage);
                projectListingRepo.save(projectListing);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public void removeImageFromProjectListing(Long projectListingId, Long imageId) throws ProjectListingNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Project> exists = projectListingRepo.findById(projectListingId);
        if (exists.isEmpty()) {
            throw new ProjectListingNotFoundException("ProjectListing id: " + projectListingId + " does not exist.");
        } else {
            ProjectListing projectListing = (ProjectListing) exists.get();
            if (user.getRoles().contains(Role.valueOf("USER_REFASHIONER")) && projectListing.getRefashioner().equals(user) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                List<Image> projectListingImages = projectListing.getImageList();
                boolean found = false;
                for (Image image : projectListingImages) {
                    log.info("current image id" + image.getId() + " while the inserted id is " + imageId);
                    if (image.getId() == imageId || image.getId().equals(imageId)) {
                        log.info("the image has been found");
                        found = true;
                        projectListingImages.remove(image);
                        imageService.deleteImage(image);
                        break;
                    }
                }
                if (!found) { //not found
                    throw new ImageNotFoundException("Project Listing does not contain this image!");
                }
                projectListing.setImageList(projectListingImages);
                projectListingRepo.save(projectListing);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        }
    }

    @Override
    public ProjectListing retrieveProjectListingById(Long id) throws ProjectListingNotFoundException {
        ProjectListing exists = projectListingRepo.findByProjectId(id);
        if (exists == null) {
            throw new ProjectListingNotFoundException("ProjectListing id: " + id + " does not exist.");
        } else {
            return exists;
        }
    }

    @Override
    public List<ProjectListing> retrieveProjectListingsByRefashionerId(Long refashionerId) throws UserDoesNotExistException, ProjectListingNotFoundException, NotARefashionerException {

        Optional<AppUser> curr = appUserRepo.findById(refashionerId);
        if (curr.isEmpty()) {
            throw new UserDoesNotExistException("User with id: " + refashionerId + " cannot be found.");
        }

        AppUser user = curr.get();
        if (user.getRoles().contains(Role.USER_REFASHIONER)) {
            List<ProjectListing> projects = projectListingRepo.findByRefashionerId(refashionerId);
            if (projects.isEmpty()) {
                throw new ProjectListingNotFoundException("No project listings exist under refashioner with refashioner id: " + refashionerId);
            } else {
                return projects;
            }
        }
        throw new NotARefashionerException("User with id: " + refashionerId + " is not a refashioner");
    }

    // for admin to search across ALL project listings
    // search by cat and/or project listing title
    @Override
    public List<ProjectListing> searchAllProjectListings(Optional<Long[]> cIds, Optional<String> keyword) {

        Set<ProjectListing> projectListings = new HashSet<>();

        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectListings.addAll(projectListingRepo.findByCategoryIdIn(ids));
        } else if (keyword.isPresent() && cIds.isEmpty()) {
            projectListings.addAll(projectListingRepo.findByTitleContainingIgnoreCase(keyword.get()));
        } else if (keyword.isPresent() && cIds.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectListings.addAll(projectListingRepo.findByCategoryIdInAndTitleContainingIgnoreCase(ids, keyword.get()));
        }
        List<ProjectListing> projectListings2 = new ArrayList<>();
        projectListings2.addAll(projectListings);
        return projectListings2;
    }

    // search project listings for use case "I'm looking for..."
    // search by cat and/or material and/or project listing title
    @Override
    public List<ProjectListing> searchProjectListings(Optional<Long[]> cIds, Optional<String> keyword) throws
            ProjectListingNotFoundException {

        Set<ProjectListing> projectListings = new HashSet<>();

        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectListings.addAll(projectListingRepo.findByCategoryIdInAndIsAvailableTrue(ids));

        } else if (keyword.isPresent() && cIds.isEmpty()) {
            projectListings.addAll(projectListingRepo.findByMaterialNameAndIsAvailableTrue(keyword.get()));
            projectListings.addAll(projectListingRepo.findByTitleContainingIgnoreCaseAndIsAvailableTrue(keyword.get()));
            projectListings.addAll(projectListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(keyword.get()));
        } else if (keyword.isPresent() && cIds.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectListings.addAll(projectListingRepo.findByCategoryAndMaterialName(ids, keyword.get()));
            projectListings.addAll(projectListingRepo.findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(ids, keyword.get()));
            projectListings.addAll(projectListingRepo.findByCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrue(ids, keyword.get()));
        }

        if (projectListings.isEmpty()) {
            throw new ProjectListingNotFoundException("No Project Listings are found under keyword search");
        }

        List<ProjectListing> projectListings2 = new ArrayList<>();
        projectListings2.addAll(projectListings);

        return projectListings2;
    }

    // Refashioner searches for his own listings
    @Override
    public List<ProjectListing> searchOwnProjectListings(Optional<Long[]> cIds, Optional<String> keyword) throws
            ProjectListingNotFoundException {

        Set<ProjectListing> projectListings = new HashSet<>();

        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectListings.addAll(projectListingRepo.findByCategoryIdInAndRefashionerUsernameAndIsAvailableTrue(ids, userService.getCurrentUsername()));

        } else if (keyword.isPresent() && cIds.isEmpty()) {
            projectListings.addAll(projectListingRepo.findByMaterialNameAndUsername(userService.getCurrentUsername(), keyword.get()));
            projectListings.addAll(projectListingRepo.findByTagNameAndUsername(userService.getCurrentUsername(), keyword.get()));
            projectListings.addAll(projectListingRepo.findByRefashionerUsernameAndTitleContainingIgnoreCase(userService.getCurrentUsername(), keyword.get()));
            // category name
            projectListings.addAll(projectListingRepo.findByRefashionerUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(userService.getCurrentUsername(), keyword.get()));
        }

        if (projectListings.isEmpty()) {
            throw new ProjectListingNotFoundException("No Project Listings are found under keyword search");
        }

        List<ProjectListing> projectListings2 = new ArrayList<>();
        projectListings2.addAll(projectListings);

        return projectListings2;
    }

    // search project listings for use case "Refashion ideas for..."
    // search by cat and/or project listing title and/or tag
    @Override
    public List<ProjectListing> searchProjectListings2(Optional<Long[]> cIds, Optional<String> keyword) throws
            ProjectListingNotFoundException {

        Set<ProjectListing> projectListings = new HashSet<>();

        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectListings.addAll(projectListingRepo.findByCategoryIdInAndIsAvailableTrue(ids));
        } else if (keyword.isPresent() && cIds.isEmpty()) {
            projectListings.addAll(projectListingRepo.findByTitleContainingIgnoreCaseAndIsAvailableTrue(keyword.get()));
            projectListings.addAll(projectListingRepo.findByTagName(keyword.get()));
            projectListings.addAll(projectListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(keyword.get()));
        } else if (keyword.isPresent() && cIds.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectListings.addAll(projectListingRepo.findByCategoryAndTagName(ids, keyword.get()));
            projectListings.addAll(projectListingRepo.findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(ids, keyword.get()));
            projectListings.addAll(projectListingRepo.findByCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrue(ids, keyword.get()));
        }

        if (projectListings.isEmpty()) {
            throw new ProjectListingNotFoundException("No Project Listings are found under keyword search");
        }

        List<ProjectListing> projectListings2 = new ArrayList<>();
        projectListings2.addAll(projectListings);

        return projectListings2;
    }

    // only available PLs
    @Override
    public List<ProjectListing> retrieveProjectListingsByUsername(String username) {
        List<ProjectListing> projectListings = projectListingRepo.findByRefashionerUsernameAndIsAvailableTrue(username);
        return projectListings;
    }

    @Override
    public List<ProjectListing> searchProjectListingsByUser(String username, Optional<String> keyword) {

        Set<ProjectListing> projectListings = new HashSet<>();

        if (keyword.isEmpty()) {
            projectListings.addAll(projectListingRepo.findByRefashionerUsernameAndIsAvailableTrue(username));
        } else {
            projectListings.addAll(projectListingRepo.findByMaterialNameAndUsername(username, keyword.get()));
            projectListings.addAll(projectListingRepo.findByTagNameAndUsername(username, keyword.get()));
            projectListings.addAll(projectListingRepo.findByRefashionerUsernameAndTitleContainingIgnoreCase(username, keyword.get()));
            // category name
            projectListings.addAll(projectListingRepo.findByRefashionerUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(username, keyword.get()));
        }

        List<ProjectListing> projectListings2 = new ArrayList<>();
        projectListings2.addAll(projectListings);

        return projectListings2;
    }

    @Override
    public List<ProjectListing> retrieveAvailableProjectListings() throws ProjectListingNotFoundException {

        List<ProjectListing> projectListings = new ArrayList<>();
        projectListings = projectListingRepo.findAvailableProjectListings();

        if (projectListings.isEmpty()) {
            throw new ProjectListingNotFoundException("No Project Listings are found under keyword search");
        }

        return projectListings;
    }

    @Override
    public List<ProjectListing> retrieveAllProjectListings() throws NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            List<ProjectListing> projectListings = projectListingRepo.findAllProjectListings();
            return projectListings;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public List<ProjectListing> retrieveOwnProjectListings() throws ProjectListingNotFoundException {

        List<ProjectListing> projectListings = projectListingRepo.findByRefashionerUsername(userService.getCurrentUsername());

        if (projectListings.isEmpty()) {
            throw new ProjectListingNotFoundException("You do not have any project listings");
        }
        return projectListings;
    }

    @Override
    public ProjectListing updateProjectListing(ProjectListing newProjectListing) throws
            ProjectListingNotFoundException, NoAccessRightsException {
        Optional<Project> projectListing = projectListingRepo.findById(newProjectListing.getId());
        if (projectListing.isEmpty()) {
            throw new ProjectListingNotFoundException("ProjectListing listing with id: " + newProjectListing.getId() + " not found!");
        } else {
            ProjectListing projectListingToUpdate = (ProjectListing) projectListing.get();

            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            AppUser userInListing = projectListingToUpdate.getRefashioner();

            if (user.equals(userInListing) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
//                projectListingToUpdate.setRefashioner(newProjectListing.getRefashioner());
//                projectListingToUpdate.setDateCreated(newProjectListing.getDateCreated());
                projectListingToUpdate.setPrice(newProjectListing.getPrice());
//                projectListingToUpdate.setOffers(newProjectListing.getOffers());
                projectListingToUpdate.setAvailable(newProjectListing.isAvailable());
                projectListingToUpdate.setTitle(newProjectListing.getTitle());
                projectListingToUpdate.setDescription(newProjectListing.getDescription());
                projectListingToUpdate.setCategory(newProjectListing.getCategory());
                projectListingToUpdate.setTimeToCompleteInDays(newProjectListing.getTimeToCompleteInDays());

                List<Material> materialList = new ArrayList<>();
                List<Tag> tagList = new ArrayList<>();
                if (newProjectListing.getMaterialList().size() != 0) {
                    for (Material m : newProjectListing.getMaterialList()) {
                        Material material = materialRepo.save(m);
                        materialList.add(material);
                    }
                }

                if (newProjectListing.getTagList().size() != 0) {
                    for (Tag t : newProjectListing.getTagList()) {
                        Tag tag = tagRepo.save(t);
                        tagList.add(tag);
                    }
                }

                projectListingToUpdate.setMaterialList(materialList);
                projectListingToUpdate.setTagList(tagList);

                projectListingRepo.save(projectListingToUpdate);
                return projectListingToUpdate;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public void deleteProjectListing(Long id) throws ProjectListingNotFoundException, NoAccessRightsException {

        Optional<Project> projectListing = projectListingRepo.findById(id);
        if (projectListing.isEmpty()) {
            throw new ProjectListingNotFoundException("ProjectListing with id: " + id + " not found!");
        } else {
            ProjectListing projectListingToDelete = (ProjectListing) projectListing.get();
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            AppUser userInListing = projectListingToDelete.getRefashioner();

            if (user.equals(userInListing) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                projectListingToDelete.setAvailable(false);
                projectListingRepo.saveAndFlush(projectListingToDelete);
//                projectListingRepo.delete(projectListingToDelete);
//                projectListingRepo.flush();
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public void favouriteProjectListing(Long id) throws
            ProjectListingNotFoundException, ProjectListingAlreadyFavouritedException {
        Optional<Project> projectListing = projectListingRepo.findById(id);
        if (projectListing.isEmpty()) {
            throw new ProjectListingNotFoundException(("Project Listing with id: " + id + " cannot be found."));
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            List<ProjectListing> projectListings = appUser.getProjectListingFavourites();
            if (projectListings.contains(projectListing.get())) {
                throw new ProjectListingAlreadyFavouritedException("This project listing with the id: " + id + " already exists in your favourites.");
            } else {
                projectListings.add((ProjectListing) projectListing.get());
                appUser.setProjectListingFavourites(projectListings);
                appUserRepo.save(appUser);
            }
        }

    }

    @Override
    public void unfavouriteProjectListing(Long id) throws
            ProjectListingNotFoundException, FavouriteNotFoundException {
        Optional<Project> projectListing = projectListingRepo.findById(id);
        if (projectListing.isEmpty()) {
            throw new ProjectListingNotFoundException(("Project Listing with id: " + id + " cannot be found."));
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            List<ProjectListing> projectListings = appUser.getProjectListingFavourites();
            if (!projectListings.contains(projectListing.get())) {
                throw new FavouriteNotFoundException("This project listing with the id: " + id + " does not exist in your favourites.");
            } else {
                projectListings.remove((ProjectListing) projectListing.get());
                appUser.setProjectListingFavourites(projectListings);
                appUserRepo.save(appUser);
            }
        }
    }

    @Override
    public List<ProjectListing> retrieveFavouritedProjectListings() {
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
        List<ProjectListing> projectListings = appUser.getProjectListingFavourites();
        return projectListings;
    }
}

