package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.*;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.CategoryRepo;
import com.altnative.Alt.Native.Repository.SwapRequestRepo;
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
public class SwapRequestServiceImpl implements SwapRequestService {

    private final AppUserService appUserService;
    private final UserService userService;
    private final ImageService imageService;
    private final SwapRequestRepo swapRequestRepo;
    private final CategoryRepo categoryRepo;

    @Override
    public SwapRequest createSwapRequest(String itemName, String itemDescription, Long categoryId, List<MultipartFile> imageList, ItemCondition itemCondition) throws InvalidFileException, S3Exception, ImageCannotBeEmptyException, CategoryNotFoundException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        SwapRequest swapRequest = new SwapRequest();
        swapRequest.setItemName(itemName);
        swapRequest.setItemDescription(itemDescription);
        swapRequest.setItemCondition(itemCondition);

        if (imageList != null && imageList.size() >= 2) {
            swapRequest.setImageList(new ArrayList<Image>());

            for (int i = 0; i < imageList.size(); i++) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), imageList.get(i).getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, imageList.get(i));
                swapRequest.getImageList().add(newImage);
            }
        } else {
            throw new ImageCannotBeEmptyException("You have to upload images for your swap request!");
        }

        swapRequest.setAppUser(user);
        user.getSwapRequests().add(swapRequest);
        swapRequest.setSwapRequestStatus(SwapRequestStatus.PENDING);

        Category category = categoryRepo.findById(categoryId).orElseThrow(
                () -> new CategoryNotFoundException("Category id: " + categoryId + " does not exist."));

        category.getSwapRequests().add(swapRequest);
        swapRequest.setCategory(category);

        swapRequestRepo.save(swapRequest);
        return swapRequest;

    }

    @Override
    public SwapRequest updateTrackingNumberForSwapRequest(Long swapRequestId, String trackingNumber) throws SwapRequestNotFoundException, NoAccessRightsException {
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (swapRequestOpt.isEmpty()) {
            throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            SwapRequest swapRequest = swapRequestOpt.get();

            if (appUser.getSwapRequests().contains(swapRequest) || swapRequest.getAppUser().equals(appUser) || appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                swapRequest.setTrackingNumber(trackingNumber);
                return swapRequest;
            }
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public SwapRequest updateStatusForSwapRequest(Long swapRequestId, SwapRequestStatus swapRequestStatus) throws SwapRequestNotFoundException, NoAccessRightsException {
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (swapRequestOpt.isEmpty()) {
            throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            SwapRequest swapRequest = swapRequestOpt.get();

            if (appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                swapRequest.setSwapRequestStatus(swapRequestStatus);
                return swapRequest;
            }
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public SwapRequest retrieveSwapRequestById(Long swapRequestId) throws SwapRequestNotFoundException, NoAccessRightsException {
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (swapRequestOpt.isEmpty()) {
            throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            SwapRequest swapRequest = swapRequestOpt.get();

            if (appUser.getSwapRequests().contains(swapRequest) || swapRequest.getAppUser().equals(appUser) || appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                return swapRequest;
            }
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public List<SwapRequest> retrieveListOfSwapRequests() throws NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            List<SwapRequest> swapRequestList = swapRequestRepo.findAll();
            return swapRequestList;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public SwapRequest approveSwapRequest(Long swapRequestId, Integer credits) throws SwapRequestAlreadyCreditedException, SwapRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            if (swapRequestOpt.isEmpty()) {
                throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
            } else {
                SwapRequest swapRequest = swapRequestOpt.get();
                if (swapRequest.getSwapRequestStatus().equals(SwapRequestStatus.APPROVED_AND_CREDITED)) {
                    throw new SwapRequestAlreadyCreditedException("This swap request has already been credited.");
                }
                AppUser swapper = swapRequest.getAppUser();
                swapRequest.setCreditsToAppUser(credits);
                swapRequest.setSwapRequestStatus(SwapRequestStatus.APPROVED_AND_CREDITED);
                swapper.setCredits(swapper.getCredits() + credits);
            }
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
        return swapRequestOpt.get();
    }

    @Override
    public SwapRequest rejectSwapRequestWithCredits(Long swapRequestId, String remarks, Integer credits) throws SwapRequestAlreadyCreditedException, SwapRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            if (swapRequestOpt.isEmpty()) {
                throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
            } else {
                SwapRequest swapRequest = swapRequestOpt.get();
                AppUser swapper = swapRequest.getAppUser();
                if (swapRequest.getSwapRequestStatus().equals(SwapRequestStatus.REJECTED_PENDING_FOLLOWUP)) { //means credited already or not applicable
                    throw new SwapRequestAlreadyCreditedException("This swap request cannot be credited.");
                }
                swapRequest.setCreditsToAppUser(credits);
                swapRequest.setAdminRemarks(remarks);
                swapRequest.setSwapRequestStatus(SwapRequestStatus.REJECTED_PENDING_FOLLOWUP);
                swapRequest.setFollowUpStatus(FollowUpStatus.PENDING_RESPONSE);
                swapper.setCredits(swapper.getCredits() + credits);
                //Follow up with appUser: 1) Retrieve back item via delivery 2) Retrieve back item via self-collect 3) Disposal
            }
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
        return swapRequestOpt.get();
    }

    @Override
    public SwapRequest rejectSwapRequest(Long swapRequestId, String remarks) throws SwapRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            if (swapRequestOpt.isEmpty()) {
                throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
            } else {
                SwapRequest swapRequest = swapRequestOpt.get();
                swapRequest.setAdminRemarks(remarks);
                swapRequest.setSwapRequestStatus(SwapRequestStatus.REJECTED_PENDING_FOLLOWUP);
                swapRequest.setFollowUpStatus(FollowUpStatus.PENDING_RESPONSE);
                //Follow up with appUser: 1) Retrieve back item via delivery 2) Retrieve back item via self-collect 3) Disposal
            }
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
        return swapRequestOpt.get();
    }

    @Override
    public void deleteSwapRequest(Long swapRequestId) throws SwapRequestNotFoundException, NoAccessRightsException {
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (swapRequestOpt.isEmpty()) {
            throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            SwapRequest swapRequest = swapRequestOpt.get();
            if (appUser.getSwapRequests().contains(swapRequest) || swapRequest.getAppUser().equals(appUser) || appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                swapRequestRepo.delete(swapRequest);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public List<SwapRequest> retrieveOwnSwapRequests() {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        return user.getSwapRequests();
    }

    @Override
    public SwapRequest followUpRejectedItem(Long swapRequestId, FollowUpStatus followUpStatus) throws SwapRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (swapRequestOpt.isEmpty()) {
            throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
        } else {
            SwapRequest swapRequest = swapRequestOpt.get();
            if (user.getSwapRequests().contains(swapRequest) || swapRequest.getAppUser().equals(user) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                //Different cases for follow up status
                if (followUpStatus.equals(FollowUpStatus.DISCARD)) {
                    swapRequest.setFollowUpStatus(FollowUpStatus.DISCARD); //can proceed to discard item
                } else if (followUpStatus.equals(FollowUpStatus.DONATE_PENDING)) {
                    swapRequest.setFollowUpStatus(FollowUpStatus.DONATE_PENDING);
                } else { //(followUpStatus.equals(FollowUpStatus.SELF_COLLECTION_REQUESTED)) {
                     //self-collect, pending collection -- will update to completed once collected
                    swapRequest.setFollowUpStatus(FollowUpStatus.SELF_COLLECTION_PENDING);
                }
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
            return swapRequest;
        }
    }

    @Override
    public SwapRequest updateFollowUpStatusToComplete(Long swapRequestId) throws SwapRequestNotFoundException, SwapRequestAlreadyCompletedException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<SwapRequest> swapRequestOpt = swapRequestRepo.findById(swapRequestId);
        if (swapRequestOpt.isEmpty()) {
            throw new SwapRequestNotFoundException("Swap Request with id: " + swapRequestId + " not found!");
        } else {
            SwapRequest swapRequest = swapRequestOpt.get();
            if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
                if (swapRequest.getSwapRequestStatus().equals(SwapRequestStatus.COMPLETED)) {
                    throw new SwapRequestAlreadyCompletedException("This swap request has already been completed");
                } else {
                    swapRequest.setFollowUpStatus(FollowUpStatus.COMPLETED);
                    swapRequest.setSwapRequestStatus(SwapRequestStatus.COMPLETED); //can proceed to discard item
                }
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
        return swapRequestOpt.get();
    }

}
