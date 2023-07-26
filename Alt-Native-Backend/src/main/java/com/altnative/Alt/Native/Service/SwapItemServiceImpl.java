package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.*;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.CategoryRepo;
import com.altnative.Alt.Native.Repository.MilestoneRepo;
import com.altnative.Alt.Native.Repository.Order2Repo;
import com.altnative.Alt.Native.Repository.SwapItemRepo;
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
public class SwapItemServiceImpl implements SwapItemService {
    private final SwapItemRepo swapItemRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final ImageService imageService;
    private final CategoryRepo categoryRepo;
    private final Order2Repo order2Repo;
    private final DeliveryService deliveryService;
    private final MilestoneRepo milestoneRepo;

    @Override
    public SwapItem createSwapItem(String itemName, String itemDescription, Long categoryId, List<MultipartFile> imageList, ItemCondition itemCondition, Integer credits) throws NoAccessRightsException, InvalidFileException, S3Exception, ImageCannotBeEmptyException, CategoryNotFoundException {
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

        if (appUser.getRoles().contains(Role.ADMIN)) {
            SwapItem swapItem = new SwapItem();
            swapItem.setTitle(itemName);
            swapItem.setDescription(itemDescription);

            if (imageList != null && imageList.size() >= 2) { //front and back
                swapItem.setImageList(new ArrayList<Image>());

                for (int i = 0; i < imageList.size(); i++) {
                    String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), appUser.getId());
                    String filename = String.format("%s-%s", UUID.randomUUID(), imageList.get(i).getOriginalFilename());
                    Image newImage = new Image();
                    newImage.setPath(path);
                    newImage.setFileName(filename);
                    newImage = imageService.createImage(newImage, imageList.get(i));
                    swapItem.getImageList().add(newImage);
                }
            } else {
                throw new ImageCannotBeEmptyException("You have to upload images for your swap item.");
            }

            swapItem.setItemCondition(itemCondition);
            swapItem.setCredits(credits);
            swapItem.setDateCreated(Calendar.getInstance().getTime());
            swapItem.setAppUser(appUser);
            appUser.getSwapItems().add(swapItem);

            Category category = categoryRepo.findById(categoryId).orElseThrow(
                    () -> new CategoryNotFoundException("Category id: " + categoryId + " does not exist."));

            category.getSwapItems().add(swapItem);
            swapItem.setCategory(category);

            swapItemRepo.save(swapItem);
            swapItemRepo.flush();
            return swapItem;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public void deleteSwapItem(Long itemId) throws ItemNotFoundException, NoAccessRightsException {
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

        if (appUser.getRoles().contains(Role.ADMIN)) {
            SwapItem swapItem = retrieveSwapItemById(itemId);
            swapItemRepo.delete(swapItem);
            swapItemRepo.flush();
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }

    }

    @Override
    public SwapItem updateSwapItem(Long itemId, SwapItem newSwapItem) throws ItemNotFoundException, NoAccessRightsException {
        SwapItem swapItemToUpdate = retrieveSwapItemById(itemId);

        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

        if (appUser.getRoles().contains(Role.ADMIN)) {
            swapItemToUpdate.setTitle(newSwapItem.getTitle());
            swapItemToUpdate.setDescription(newSwapItem.getDescription());
            swapItemToUpdate.setCategory(newSwapItem.getCategory());
            swapItemToUpdate.setImageList(newSwapItem.getImageList());
            swapItemToUpdate.setItemCondition(newSwapItem.getItemCondition());
            swapItemToUpdate.setCredits(newSwapItem.getCredits());

            swapItemRepo.saveAndFlush(swapItemToUpdate);
            return swapItemToUpdate;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public void addImageToSwapItem(Long itemId, MultipartFile file) throws ItemNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException {
        SwapItem swapItem = retrieveSwapItemById(itemId);
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
        if (appUser.getRoles().contains(Role.ADMIN)) {
            Image image = imageService.createImage(appUser, file);
            swapItem.getImageList().add(image);
            swapItemRepo.saveAndFlush(swapItem);
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public void removeImageFromSwapItem(Long itemId, Long imageId) throws ItemNotFoundException, NoAccessRightsException, ImageNotFoundException {
        Image image = imageService.retrieveImageById(imageId);
        SwapItem swapItem = retrieveSwapItemById(itemId);
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
        if (appUser.getRoles().contains(Role.ADMIN)) {
            swapItem.getImageList().remove(image);
            swapItemRepo.saveAndFlush(swapItem);
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public SwapItem retrieveSwapItemById(Long itemId) throws ItemNotFoundException, NoAccessRightsException {
        Optional<SwapItem> swapItemOptional = swapItemRepo.findById(itemId);
        if (swapItemOptional.isEmpty()) {
            throw new ItemNotFoundException("Swap item with id: " + itemId + " not found!");
        } else {
            SwapItem swapItem = swapItemOptional.get();
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

            if (appUser.getSwapItems().contains(swapItem) || swapItem.getAppUser().equals(appUser) || appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                return swapItem;
            }
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public List<SwapItem> retrieveListOfSwapItems() throws NoAccessRightsException, NoSwapItemsExistException {
        List<SwapItem> swapItems = swapItemRepo.findAll();
        if (swapItems.isEmpty()) {
            throw new NoSwapItemsExistException("There are no swap items added yet.");
        } else {
            return swapItems;
        }
    }

    @Override
    public SwapItem purchaseSwapItem(Long itemId) throws ItemNotFoundException, InsufficientCreditsException {
        Optional<SwapItem> swapItemOptional = swapItemRepo.findById(itemId);
        if (swapItemOptional.isEmpty()) {
            throw new ItemNotFoundException("Item with id: " + itemId + " does not exist!");
        } else {
            SwapItem swapItem = swapItemOptional.get();
            //Check credits first
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            Integer currCredits = appUser.getCredits();
            Integer requiredCredits = swapItem.getCredits();
            if (requiredCredits > currCredits) {
                throw new InsufficientCreditsException("You do not have sufficient credits to get this item!");
            } else {
                //Mark the swap item as unavailable first
                log.info("Deducting credits: " + requiredCredits);
                log.info("You have " + (currCredits - requiredCredits) + " remaining.");
                swapItem.setAvailable(false);
                swapItem.setAppUser(appUser);
                appUser.setCredits(currCredits - requiredCredits);

                swapItemRepo.save(swapItem);

                //Create a new order for this swap item
                Order2 swapOrder = new Order2();
                swapOrder.setOrderTime(new Date());
                swapOrder.setDeliveries(new ArrayList<>());
                swapOrder.setOfferType(OfferType.SWAP_LISTING);
                swapOrder.setSwapRequesterUsername(appUser.getUsername());
                swapOrder.setAppUserUsername(appUser.getUsername());
                order2Repo.save(swapOrder);

                Milestone m = new Milestone();
                m.setDate(Calendar.getInstance().getTime());
                m.setMilestoneEnum(MilestoneEnum.ORDER_STARTED);
                log.info("Order id is " + swapOrder.getId());
                m.setOrderId(swapOrder.getId());
                milestoneRepo.save(m);

                swapOrder.getMilestones().add(m);
                //Arrange for Delivery
            }
            return swapItem;
        }
    }
}
