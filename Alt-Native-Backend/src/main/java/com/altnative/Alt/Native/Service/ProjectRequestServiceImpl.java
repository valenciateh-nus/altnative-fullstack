package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Exceptions.ProjectRequestNotFoundException;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Model.ProjectRequest;
import com.altnative.Alt.Native.Repository.CategoryRepo;
import com.altnative.Alt.Native.Repository.ProjectRequestRepo;
import com.amazonaws.services.ecr.model.ImageNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProjectRequestServiceImpl implements ProjectRequestService {
    private final Order2Service order2Service;
    private final OfferService offerService;
    private final ProjectRequestRepo projectRequestRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final CategoryRepo categoryRepo;
    private final ImageService imageService;

    // refashionee publishes PR directly
    @Override
    public ProjectRequest createProjectRequest(Long cId, ProjectRequest projectRequest, List<MultipartFile> files) throws UsernameNotFoundException, CategoryNotFoundException, InvalidFileException, S3Exception {

        // retrieve logged in refashionee entity by id
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        Category category = categoryRepo.findById(cId).orElseThrow(
                () -> new CategoryNotFoundException("Category id: " + cId + " does not exist."));

        if (files != null) {
            projectRequest.setImageList(new ArrayList<Image>());

            for (int i = 0; i < files.size(); i++) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, files.get(i));
                projectRequest.getImageList().add(newImage);
            }
        }

        // set user to project request entity
        projectRequest.setRefashionee(user);
        projectRequest.setCategory(category);
        user.getProjectRequests().add(projectRequest);
        category.getProjects().add(projectRequest);
        if (user.getRoles().contains(Role.valueOf("USER_BUSINESS"))) {
            projectRequest.setBusiness(true);
        }
        //status is by set to pending review
        projectRequest.setRequestStatus(RequestStatus.PUBLISHED);

        // projectRequest entity to DB
        log.info("Saving new projectRequest {} to db", projectRequest.getDescription());
        projectRequestRepo.save(projectRequest);
        return projectRequest;
    }

    @Override
    public void addImageToProjectRequest(Long projectRequestId, MultipartFile file) throws ProjectRequestNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Project> exists = projectRequestRepo.findById(projectRequestId);
        if (exists.isEmpty()) {
            throw new ProjectRequestNotFoundException("ProjectRequest id: " + projectRequestId + " does not exist.");
        } else {
            ProjectRequest projectRequest = (ProjectRequest) exists.get();
            if (projectRequest.getRequestStatus().equals(RequestStatus.PUBLISHED) || projectRequest.getRequestStatus().equals(RequestStatus.REJECTED)) {
                throw new NoAccessRightsException("You do not have the rights to edit this project request and add images to it!");
            }

            if (projectRequest.getRefashionee().equals(user) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, file);
                projectRequest.getImageList().add(newImage);
                projectRequestRepo.save(projectRequest);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    // refashionee publishes a PR draft
    @Override
    public ProjectRequest submitProjectRequestInDraft(Long projectRequestId, ProjectRequest projectRequest) throws
            ProjectRequestNotFoundException, ProjectRequestCannotBeModifiedException, ProjectRequestAlreadySubmittedException, NoAccessRightsException {

        Optional<Project> currProjectRequest = projectRequestRepo.findById(projectRequestId);
        if (currProjectRequest.isEmpty()) {
            throw new ProjectRequestNotFoundException("ProjectRequest with id: " + projectRequestId + " not found!");
        }

        ProjectRequest updatedPR = editProjectRequestInDraft(projectRequestId, projectRequest);
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        AppUser userInDraft = updatedPR.getRefashionee();

        if (user.equals(userInDraft) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
            if (updatedPR.getRequestStatus() == RequestStatus.DRAFT) {
                updatedPR.setDateCreated(new Date());
                updatedPR.setRequestStatus(RequestStatus.PUBLISHED); //published for administrators to check
                projectRequestRepo.save(updatedPR);
            } else {
                throw new ProjectRequestAlreadySubmittedException("Project Request has already been submitted.");
            }
            return updatedPR;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public void removeImageFromProjectRequest(Long projectRequestId, Long imageId) throws ProjectRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Project> exists = projectRequestRepo.findById(projectRequestId);
        if (exists.isEmpty()) {
            throw new ProjectRequestNotFoundException("ProjectRequest id: " + projectRequestId + " does not exist.");
        } else {
            ProjectRequest projectRequest = (ProjectRequest) exists.get();
            List<Image> projectRequestImages = projectRequest.getImageList();
            boolean found = false;
            for (Image image : projectRequestImages) {
                log.info("current image id" + image.getId() + " while the inserted id is " + imageId);
                if (image.getId() == imageId || image.getId().equals(imageId)) {
                    log.info("the image has been found");
                    found = true;
                    projectRequestImages.remove(image);
                    imageService.deleteImage(image);
                    break;
                }
            }
            if (!found) { //not found
                throw new ImageNotFoundException("Project Request does not contain this image!");
            }
            projectRequestRepo.save(projectRequest);
        }
    }

    // Refashionee saves PR as draft
    @Override
    public ProjectRequest createProjectRequestAsDraft(Long cId, ProjectRequest projectRequest, List<MultipartFile> files) throws UsernameNotFoundException, CategoryNotFoundException, InvalidFileException, S3Exception {

        // retrieve logged in refashionee entity by id
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        // retrieve category entity by id
        Category category = categoryRepo.findById(cId).orElseThrow(
                () -> new CategoryNotFoundException("Category id: " + cId + " does not exist."));

        if (files != null) {
            projectRequest.setImageList(new ArrayList<Image>());

            for (int i = 0; i < files.size(); i++) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, files.get(i));
                projectRequest.getImageList().add(newImage);
            }
        }
        // set user to project request entity
        projectRequest.setRefashionee(user);
        projectRequest.setCategory(category);
        user.getProjectRequests().add(projectRequest);
        category.getProjects().add(projectRequest);
        if (user.getRoles().contains(Role.valueOf("USER_BUSINESS"))) {
            projectRequest.setBusiness(true);
        }
        //status is by set to DRAFT
        projectRequest.setRequestStatus(RequestStatus.DRAFT);

        // projectRequest entity to DB
        log.info("Saving new projectRequest {} to db", projectRequest.getDescription());
        projectRequestRepo.save(projectRequest);
        return projectRequest;
    }

    @Override
    public ProjectRequest editProjectRequestInDraft(Long pId, ProjectRequest newProjectRequest) throws
            ProjectRequestNotFoundException, ProjectRequestCannotBeModifiedException, NoAccessRightsException {
        //this method can only be used if the project request was previously saved as draft
        //anything that is published CANNOT BE edited
        //most fields can be modified: except date created, offers and appUsers not required
        Optional<Project> projectRequest = projectRequestRepo.findById(pId);
        if (projectRequest.isEmpty()) {
            throw new ProjectRequestNotFoundException("ProjectRequest with id: " + newProjectRequest.getId() + " not found!");
        } else {
            ProjectRequest projectRequestToUpdate = (ProjectRequest) projectRequest.get();
            if (projectRequestToUpdate.getRequestStatus() == RequestStatus.PUBLISHED || projectRequestToUpdate.getRequestStatus() == RequestStatus.REJECTED) {
                throw new ProjectRequestCannotBeModifiedException("Project Request with id: " + newProjectRequest.getId() + " has status " + newProjectRequest.getRequestStatus() + ". It cannot be modified.");
            }
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            AppUser userInDraft = projectRequestToUpdate.getRefashionee();

            if (user.equals(userInDraft) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                projectRequestToUpdate.setPrice(newProjectRequest.getPrice());
//                projectRequestToUpdate.setRefashionee(newProjectRequest.getRefashionee());
                projectRequestToUpdate.setTitle(newProjectRequest.getTitle());
                projectRequestToUpdate.setDescription(newProjectRequest.getDescription());
                projectRequestToUpdate.setQuantity(newProjectRequest.getQuantity());
                projectRequestToUpdate.setMinimum(newProjectRequest.getMinimum());
                projectRequestToUpdate.setTagList(newProjectRequest.getTagList());
                projectRequestToUpdate.setMaterialList(newProjectRequest.getMaterialList());
                projectRequestToUpdate.setCategory(newProjectRequest.getCategory());
                projectRequestToUpdate.setProposedCompletionDate(newProjectRequest.getProposedCompletionDate());

                projectRequestRepo.save(projectRequestToUpdate);
                return projectRequestToUpdate;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }


    @Override
    public ProjectRequest retrieveProjectRequestById(Long id) throws ProjectRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        ProjectRequest exists = projectRequestRepo.findByProjectId(id);
        if (exists == null) {
            throw new ProjectRequestNotFoundException("ProjectRequest id: " + id + " does not exist.");
        } else {
            return exists;
        }
    }

    @Override
    public Project retrieveProjectByOrderId(Long id) throws OrderNotFoundException, OfferNotFoundException, NoAccessRightsException {
        Order2 order = order2Service.retrieveOrderById(id);
        return offerService.retrieveProjectUnderOffer(order.getOfferId());
    }

    @Override
    public List<Offer> retrieveAllOffersToUser() throws ProjectRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        List<ProjectRequest> requests = projectRequestRepo.findByRefashioneeId(user.getId());
        List<Offer> offers = new ArrayList<>();
        for (ProjectRequest r : requests) {
            offers.addAll(offerService.retrieveOffersByReqId(r.getId()));
        }
        return offers;
    }

    @Override
    public List<ProjectRequest> retrieveAllProjectRequests() throws ProjectRequestNotFoundException {

        List<ProjectRequest> projectRequests = new ArrayList<>();

        for (ProjectRequest projectRequest: projectRequestRepo.findAllProjectRequests()) {
            projectRequests.add(projectRequest);
        }

        if (projectRequests.isEmpty()) {
            throw new ProjectRequestNotFoundException("No project requests found.");
        }
        return projectRequests;
    }

    @Override
    public List<ProjectRequest> retrieveOwnProjectRequests() {
        return projectRequestRepo.findByRefashioneeUsername(userService.getCurrentUsername());
    }

    // only published & available prs
    @Override
    public List<ProjectRequest> retrieveProjectRequestsByUsername(String username) {
        List<ProjectRequest> projectRequests = projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), username);
        return projectRequests;
    }

    // refashionee searches for his own PRs
    // search by req status, AND/OR project request title/material/tag/cat name
    @Override
    public List<ProjectRequest> searchOwnProjectRequests(Optional<String[]> statuses, Optional<String> keyword) throws
            ProjectRequestNotFoundException {

        Set<ProjectRequest> projectRequests = new HashSet<>();
        if (statuses.isEmpty() && keyword.isPresent()) {
            projectRequests.addAll(projectRequestRepo.findByMaterialNameAndUsername(userService.getCurrentUsername(), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByTagNameAndUsername(userService.getCurrentUsername(), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRefashioneeUsernameAndTitleContainingIgnoreCase(userService.getCurrentUsername(), keyword.get()));
            // cat name
            projectRequests.addAll(projectRequestRepo.findByRefashioneeUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(userService.getCurrentUsername(), keyword.get()));
        } else if (statuses.isPresent()) {
            List<String> statusStr = Arrays.asList(statuses.get());
            List<RequestStatus> rs = new ArrayList<>();
            for (String s : statusStr) {
                rs.add(RequestStatus.valueOf(s));
            }
            if (keyword.isPresent()) {
                projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(rs, userService.getCurrentUsername(), keyword.get()));
                projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndTitleContainingIgnoreCaseAndIsAvailableTrue(rs, userService.getCurrentUsername(), keyword.get()));
                projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndTag(rs, userService.getCurrentUsername(), keyword.get()));
                projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndMaterial(rs, userService.getCurrentUsername(), keyword.get()));
            } else {
                projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndIsAvailableTrue(rs, userService.getCurrentUsername()));
            }
        }
        if (projectRequests.isEmpty()) {
            throw new ProjectRequestNotFoundException("No Project Requests are found under keyword search");
        }

        List<ProjectRequest> projectRequests2 = new ArrayList<>();
        projectRequests2.addAll(projectRequests);

        return projectRequests2;
    }

    @Override
    public List<ProjectRequest> retrieveProjectRequestsByStatus(List<RequestStatus> statuses, Optional<Boolean> isBusiness) {
        List<ProjectRequest> projectRequests = new ArrayList<>();
        if (isBusiness.isEmpty()) {
            projectRequests = projectRequestRepo.findByRequestStatusInAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED));
        } else {
            if (!isBusiness.get()) {
                projectRequests = projectRequestRepo.findByRequestStatusInAndIsAvailableTrueAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED));
            } else {
                projectRequests = projectRequestRepo.findByRequestStatusInAndIsAvailableTrueAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED));
            }
        }
        return projectRequests;
    }

    @Override
    public List<ProjectRequest> retrieveBusinessRequest(List<RequestStatus> statuses) {
        List<ProjectRequest> projectRequests = projectRequestRepo.findByRequestStatusInAndIsAvailableTrueAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED));
        return projectRequests;
    }

    // admin
    @Override
    public List<ProjectRequest> retrieveProjectRequestsByStatus2(List<RequestStatus> statuses) throws
            ProjectRequestNotFoundException {
        List<ProjectRequest> projectRequests = projectRequestRepo.findByRequestStatusInAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED));
        if (projectRequests.isEmpty()) {
            throw new ProjectRequestNotFoundException("No published project requests found.");
        }
        return projectRequests;
    }

    // admin
    // business reqs
    @Override
    public List<ProjectRequest> retrieveBusinessRequestsByStatus(List<RequestStatus> statuses)
           {
        List<ProjectRequest> projectRequests = projectRequestRepo.findByRequestStatusInAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED));
        return projectRequests;
    }

    @Override
    public List<ProjectRequest> retrieveAvailableBusinessRequestsByStatus(List<RequestStatus> statuses) {
        List<ProjectRequest> projectRequests = projectRequestRepo.findByRequestStatusInAndIsBusinessTrueAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED));
        return projectRequests;
    }

    // search by project request title/material/tag/cat name
    @Override
    public List<ProjectRequest> searchProjectRequestsByUser(String username, Optional<String> keyword) {

        Set<ProjectRequest> projectRequests = new HashSet<>();
        if (keyword.isPresent()) {
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), username, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndTitleContainingIgnoreCaseAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), username, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndTag(Arrays.asList(RequestStatus.PUBLISHED), username, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndMaterial(Arrays.asList(RequestStatus.PUBLISHED), username, keyword.get()));
        } else {
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndRefashioneeUsernameAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), username));
        }

        List<ProjectRequest> projectRequests2 = new ArrayList<>();
        projectRequests2.addAll(projectRequests);

        return projectRequests2;
    }

    // refashioners search PRs
    // search by cat id AND/OR material/tag/title/cat name
    @Override
    public List<ProjectRequest> searchProjectRequests(Optional<Long[]>
                                                              cIds, Optional<String> keyword, Optional<Boolean> isBusiness) throws
            ProjectRequestNotFoundException {

        Set<ProjectRequest> projectRequests = new HashSet<>();
        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByCategoryIdInAndRequestStatusInAndIsAvailableTrue(ids, Arrays.asList(RequestStatus.PUBLISHED)));
        } else if (cIds.isPresent() && keyword.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndMaterialName(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndTagName(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
        } else if (cIds.isEmpty() && keyword.isPresent()) {
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndMaterialName(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTitleContainingIgnoreCaseAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTagName(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
        }
        if (projectRequests.isEmpty()) {
            throw new ProjectRequestNotFoundException("No Project Requests are found under keyword search");
        }
        List<ProjectRequest> projectRequests2 = new ArrayList<>();
        projectRequests2.addAll(projectRequests);
        if (isBusiness.isEmpty()) {
            return projectRequests2;
        } else {
            List<ProjectRequest> filtered = new ArrayList<>();
            if (isBusiness.get()) {
                for (ProjectRequest pr : projectRequests2) {
                    if (pr.isBusiness()) {
                        filtered.add(pr);
                    }
                }
            } else {
                for (ProjectRequest pr : projectRequests2) {
                    if (!pr.isBusiness()) {
                        filtered.add(pr);
                    }
                }
            }
            return filtered;
        }

//        if (cIds.isPresent() && keyword.isEmpty()) {
//            List<Long> ids = Arrays.asList(cIds.get());
//            projectRequests.addAll(projectRequestRepo.findByCategoryIdInAndRequestStatusInAndIsAvailableTrueAndIsBusinessFalse(ids, Arrays.asList(RequestStatus.PUBLISHED)));
//
//        } else if (cIds.isPresent() && keyword.isPresent()) {
//            List<Long> ids = Arrays.asList(cIds.get());
//            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndMaterialName(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
//            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndTagName(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
//            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
//            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
//
//        } else if (cIds.isEmpty() && keyword.isPresent()) {
//            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndMaterialName(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
//            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTitleContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
//            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
//            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTagName(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
//        }
    }

    // refashioners search business reqs
    // search by cat id AND/OR material/tag/title/cat name
    @Override
    public List<ProjectRequest> searchBusinessRequests(Optional<Long[]> cIds, Optional<String> keyword) {

        Set<ProjectRequest> projectRequests = new HashSet<>();
        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByCategoryIdInAndRequestStatusInAndIsAvailableTrueAndIsBusinessTrue(ids, Arrays.asList(RequestStatus.PUBLISHED)));

        } else if (cIds.isPresent() && keyword.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndMaterialNameBusiness2(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndTagNameBusiness2(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));

        } else if (cIds.isEmpty() && keyword.isPresent()) {
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndMaterialNameBusiness2(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTitleContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrueAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTagNameBusiness2(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
        }
        List<ProjectRequest> projectRequests2 = new ArrayList<>();
        projectRequests2.addAll(projectRequests);

        return projectRequests2;
    }

    // admin
    // normal PRs
    @Override
    public List<ProjectRequest> searchAllProjectRequests(Optional<Long[]> cIds, Optional<String> keyword) throws
            ProjectRequestNotFoundException {

        Set<ProjectRequest> projectRequests = new HashSet<>();
        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByCategoryIdInAndRequestStatusInAndIsBusinessFalse(ids, Arrays.asList(RequestStatus.PUBLISHED)));

        } else if (cIds.isPresent() && keyword.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndMaterialName2(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndTagName2(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));

        } else if (cIds.isEmpty() && keyword.isPresent()) {
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndMaterialName2(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTitleContainingIgnoreCaseAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessFalse(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTagName2(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
        }

        if (projectRequests.isEmpty()) {
            throw new ProjectRequestNotFoundException("No Project Requests are found under keyword search");
        }

        List<ProjectRequest> projectRequests2 = new ArrayList<>();
        projectRequests2.addAll(projectRequests);

        return projectRequests2;
    }

    // admin
    @Override
    public List<ProjectRequest> searchAllBusinessRequests(Optional<Long[]> cIds, Optional<String> keyword){

        Set<ProjectRequest> projectRequests = new HashSet<>();
        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByCategoryIdInAndRequestStatusInAndIsBusinessTrue(ids, Arrays.asList(RequestStatus.PUBLISHED)));

        } else if (cIds.isPresent() && keyword.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndMaterialNameBusiness(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndTagNameBusiness(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));

        } else if (cIds.isEmpty() && keyword.isPresent()) {
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndMaterialNameBusiness(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTitleContainingIgnoreCaseAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessTrue(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTagNameBusiness(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
        }

        List<ProjectRequest> projectRequests2 = new ArrayList<>();
        projectRequests2.addAll(projectRequests);

        return projectRequests2;
    }

    @Override
    public List<ProjectRequest> searchAllAvailableBusinessRequests(Optional<Long[]>
                                                                           cIds, Optional<String> keyword) {

        Set<ProjectRequest> projectRequests = new HashSet<>();
        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByCategoryIdInAndRequestStatusInAndIsBusinessTrueAndIsAvailableTrue(ids, Arrays.asList(RequestStatus.PUBLISHED)));

        } else if (cIds.isPresent() && keyword.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndMaterialNameBusinessAndIsAvailable(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryAndTagNameBusinessAndIsAvailable(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessTrueAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryIdInAndTitleContainingIgnoreCaseAndIsBusinessTrueAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), ids, keyword.get()));

        } else if (cIds.isEmpty() && keyword.isPresent()) {
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndMaterialNameBusinessAndIsAvailable(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTitleContainingIgnoreCaseAndIsBusinessTrueAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsBusinessTrueAndIsAvailableTrue(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
            projectRequests.addAll(projectRequestRepo.findByRequestStatusInAndTagNameBusinessAndIsBusiness(Arrays.asList(RequestStatus.PUBLISHED), keyword.get()));
        }

        List<ProjectRequest> projectRequests2 = new ArrayList<>();
        projectRequests2.addAll(projectRequests);
        return projectRequests2;
    }

    @Override
    public void deleteProjectRequest(Long id) throws ProjectRequestNotFoundException, NoAccessRightsException {

        Optional<Project> projectRequest = projectRequestRepo.findById(id);
        if (projectRequest.isEmpty()) {
            throw new ProjectRequestNotFoundException("ProjectRequest with id: " + id + " not found!");
        } else {
            ProjectRequest projectRequestToDelete = (ProjectRequest) projectRequest.get();
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            AppUser userInRequest = projectRequestToDelete.getRefashionee();

            if (user.equals(userInRequest) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                projectRequestToDelete.setAvailable(false);
//                projectRequestRepo.delete(projectRequestToDelete);
                projectRequestRepo.saveAndFlush(projectRequestToDelete);
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public ProjectRequest updateProjectRequest(Long id, ProjectRequest projectRequest) throws
            ProjectRequestNotFoundException, ProjectRequestCannotBeModifiedException, NoAccessRightsException {

        //This method is to update the project request STATUS only
        Optional<Project> projRequest = projectRequestRepo.findById(id);
        if (projRequest.isEmpty()) {
            throw new ProjectRequestNotFoundException("ProjectRequest with id: " + projectRequest.getId() + " not found!");
        } else {
            ProjectRequest projectRequestToUpdate = (ProjectRequest) projRequest.get();
            //Can only be updated using this method if project request is pending review or published
            //this method is for updating offers and status
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            AppUser userInRequest = projectRequestToUpdate.getRefashionee();

            if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
                if (projectRequestToUpdate.getRequestStatus() == RequestStatus.PUBLISHED) {
                    projectRequestToUpdate.setRequestStatus(projectRequest.getRequestStatus());
//                    projectRequestToUpdate.setOffers(projectRequest.getOffers());
                    projectRequestRepo.save(projectRequestToUpdate);
                    return projectRequestToUpdate;
                } else {
                    throw new ProjectRequestCannotBeModifiedException("ProjectRequest with id: " + projectRequest.getId() + " cannot be updated!");
                }
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }
}
