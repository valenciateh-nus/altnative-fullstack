package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.MarketplaceListingStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Exceptions.FavouriteNotFoundException;
import com.altnative.Alt.Native.Exceptions.MarketplaceListingAlreadyFavouritedException;
import com.altnative.Alt.Native.Exceptions.MarketplaceListingNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoMarketplaceListingException;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.CategoryRepo;
import com.altnative.Alt.Native.Repository.AppUserRepo;
import com.altnative.Alt.Native.Repository.MarketplaceListingRepo;
import com.altnative.Alt.Native.Repository.OfferRepo;
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
public class MarketplaceListingServiceImpl implements MarketplaceListingService {
    private final MarketplaceListingRepo marketplaceListingRepo;
    private final CategoryRepo categoryRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final Order2Service order2Service;
    private final OfferRepo offerRepo;
    private final AppUserRepo appUserRepo;
    private final ImageService imageService;

    // seller publishes MPL directly
    @Override
    public MarketplaceListing createNewMarketplaceListing(Long cId, MarketplaceListing marketplaceListing, List<MultipartFile> files) throws CategoryNotFoundException, UsernameNotFoundException, InvalidFileException, S3Exception {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        Category category = categoryRepo.findById(cId).orElseThrow(
                () -> new CategoryNotFoundException("Category id: " + cId + " does not exist."));

        if (files != null) {
            marketplaceListing.setImageList(new ArrayList<Image>());

            for (int i = 0; i < files.size(); i++) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, files.get(i));
                marketplaceListing.getImageList().add(newImage);
            }
        }
        if (user.getRoles().contains(Role.valueOf("USER_BUSINESS"))) {
            marketplaceListing.setDeadstock(true);
        }
        marketplaceListing.setAppUser(user);
        marketplaceListing.setDateCreated(new Date());
        marketplaceListing.setMarketplaceListingStatus(MarketplaceListingStatus.PUBLISHED);
        user.getMarketplaceListings().add(marketplaceListing);

        category.getMarketplaceListings().add(marketplaceListing);
        marketplaceListing.setCategory(category);

        marketplaceListingRepo.save(marketplaceListing);
        return marketplaceListing;
    }

    // seller saves MPL as draft
    @Override
    public MarketplaceListing createMarketplaceListingAsDraft(Long cId, MarketplaceListing marketplaceListing, List<MultipartFile> files) throws UsernameNotFoundException, CategoryNotFoundException, InvalidFileException, S3Exception {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        Category category = categoryRepo.findById(cId).orElseThrow(
                () -> new CategoryNotFoundException("Category id: " + cId + " does not exist."));

        if (files != null) {
            marketplaceListing.setImageList(new ArrayList<Image>());

            for (int i = 0; i < files.size(); i++) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, files.get(i));
                marketplaceListing.getImageList().add(newImage);
            }
        }
        if (user.getRoles().contains(Role.valueOf("USER_BUSINESS"))) {
            marketplaceListing.setDeadstock(true);
        }
        marketplaceListing.setAppUser(user);
        marketplaceListing.setMarketplaceListingStatus(MarketplaceListingStatus.DRAFT);
        marketplaceListing.setCategory(category);
        category.getMarketplaceListings().add(marketplaceListing);

        user.getMarketplaceListings().add(marketplaceListing);
        marketplaceListingRepo.save(marketplaceListing);
        return marketplaceListing;
    }

    @Override
    public void addImageToMarketplaceListing(Long marketplaceListingId, MultipartFile file) throws MarketplaceListingNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<MarketplaceListing> exists = marketplaceListingRepo.findById(marketplaceListingId);
        if (exists.isEmpty()) {
            throw new MarketplaceListingNotFoundException("Marketplace Listing id: " + marketplaceListingId + " does not exist.");
        } else {
            MarketplaceListing marketplaceListing = exists.get();
            if (marketplaceListing.getAppUser().equals(user) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, file);
                marketplaceListing.getImageList().add(newImage);
                marketplaceListingRepo.save(marketplaceListing);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public void removeImageFromMarketplaceListing(Long marketplaceListingId, Long imageId) throws MarketplaceListingNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<MarketplaceListing> exists = marketplaceListingRepo.findById(marketplaceListingId);
        if (exists.isEmpty()) {
            throw new MarketplaceListingNotFoundException("MarketplaceListing id: " + marketplaceListingId + " does not exist.");
        } else {
            MarketplaceListing marketplaceListing = exists.get();
            if (marketplaceListing.getAppUser().equals(user) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                List<Image> marketplaceListingImages = marketplaceListing.getImageList();
                boolean found = false;
                for (Image image : marketplaceListingImages) {
                    log.info("current image id" + image.getId() + " while the inserted id is " + imageId);
                    if (image.getId() == imageId || image.getId().equals(imageId)) {
                        log.info("the image has been found");
                        found = true;
                        marketplaceListingImages.remove(image);
                        imageService.deleteImage(image);
                        break;
                    }
                }
                if (!found) { //not found
                    throw new ImageNotFoundException("Market Listing does not contain this image!");
                }
                marketplaceListing.setImageList(marketplaceListingImages);
                marketplaceListingRepo.save(marketplaceListing);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        }
    }

    @Override
    public MarketplaceListing editMarketplaceListingInDraft(Long id, MarketplaceListing newMpl) throws MarketplaceListingNotFoundException, NoAccessRightsException {

        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        Optional<MarketplaceListing> marketplaceListing = marketplaceListingRepo.findById(id);
        if (marketplaceListing.isEmpty()) {
            throw new MarketplaceListingNotFoundException("Marketplace listing with ID: " + id + " not found!");
        } else {
            MarketplaceListing mplToUpdate = marketplaceListing.get();
            AppUser creatorOfMpl = mplToUpdate.getAppUser();

            if (loggedInUser.equals(creatorOfMpl) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                mplToUpdate.setTitle(newMpl.getTitle());
                mplToUpdate.setPrice(newMpl.getPrice());
                mplToUpdate.setDescription(newMpl.getDescription());
                mplToUpdate.setCategory(newMpl.getCategory());
                mplToUpdate.setQuantity(newMpl.getQuantity());
                mplToUpdate.setMinimum(newMpl.getMinimum());

                marketplaceListingRepo.save(mplToUpdate);
                return mplToUpdate;

            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    // seller publishes a MPL draft
    @Override
    public MarketplaceListing submitMarketplaceListingInDraft(Long marketplaceListingId, MarketplaceListing mpl) throws MarketplaceListingNotFoundException, MarketplaceListingSubmittedAlreadyException, NoAccessRightsException {

        Optional<MarketplaceListing> marketplaceListingOptional = marketplaceListingRepo.findById(marketplaceListingId);
        if (marketplaceListingOptional.isEmpty()) {
            throw new MarketplaceListingNotFoundException("Marketplace listing with ID: " + marketplaceListingId + " not found!");
        } else {
            MarketplaceListing updatedMpl = editMarketplaceListingInDraft(marketplaceListingId, mpl);
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());

            if (updatedMpl.getAppUser().equals(appUser) || appUser.getMarketplaceListings().contains(updatedMpl) || appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                if (updatedMpl.getMarketplaceListingStatus() == MarketplaceListingStatus.PUBLISHED) {
                    throw new MarketplaceListingSubmittedAlreadyException("Marketplace listing has already been published.");
                } else {
                    updatedMpl.setDateCreated(new Date());
                    updatedMpl.setMarketplaceListingStatus(MarketplaceListingStatus.PUBLISHED);
                    marketplaceListingRepo.save(updatedMpl);
                }
                return updatedMpl;
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public List<MarketplaceListing> retrieveAllDraftMarketplaceListings() throws NoMarketplaceListingException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getMarketplaceListings() == null) {
            user.setMarketplaceListings(new ArrayList<>());
            throw new NoMarketplaceListingException("There are no marketplace listings created by you yet.");
        } else if (user.getMarketplaceListings().isEmpty()) {
            throw new NoMarketplaceListingException("There are no marketplace listings created by you yet.");
        } else {
            List<MarketplaceListing> draftsMpl = new ArrayList<>();
            for (MarketplaceListing mpl : user.getMarketplaceListings()) {
                if (mpl.getMarketplaceListingStatus() == MarketplaceListingStatus.DRAFT) {
                    draftsMpl.add(mpl);
                }
            }

            if (draftsMpl.isEmpty()) {
                throw new NoMarketplaceListingException("There are no drafts marketplace listings created by you yet.");
            } else {
                return draftsMpl;
            }
        }
    }

    @Override
    public List<MarketplaceListing> retrievePublishedMarketplaceListings() throws NoMarketplaceListingException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getMarketplaceListings() == null) {
            user.setMarketplaceListings(new ArrayList<>());
            throw new NoMarketplaceListingException("There are no marketplace listings created by you yet.");
        } else if (user.getMarketplaceListings().isEmpty()) {
            throw new NoMarketplaceListingException("There are no marketplace listings created by you yet.");
        } else {
            List<MarketplaceListing> publishedMpl = new ArrayList<>();
            for (MarketplaceListing mpl : user.getMarketplaceListings()) {
                if (mpl.getMarketplaceListingStatus() == MarketplaceListingStatus.PUBLISHED) {
                    publishedMpl.add(mpl);
                }
            }

            if (publishedMpl.isEmpty()) {
                throw new NoMarketplaceListingException("There are no drafts marketplace listings published by you yet.");
            } else {
                return publishedMpl;
            }
        }
    }

    @Override
    public MarketplaceListing retrieveMarketplaceListingById(Long id) throws MarketplaceListingNotFoundException {
        Optional<MarketplaceListing> mpl = marketplaceListingRepo.findById(id);

        if (mpl.isEmpty()) {
            log.info("Marketplace listing does not exist.");
            throw new MarketplaceListingNotFoundException("Marketplace Listing not found, id: " + id);
        } else {
            return mpl.get();
        }
    }

    // Seller searches for his own listings
    // search by cat id(s) OR keyword for listing title/cat name
    @Override
    public List<MarketplaceListing> searchOwnMarketplaceListings(Optional<Long[]> cIds, Optional<String> keyword) throws NoMarketplaceListingException {

        Set<MarketplaceListing> mplList = new HashSet<>();
        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndAppUserUsernameAndIsAvailableTrue(ids, userService.getCurrentUsername()));

        } else if (keyword.isPresent() && cIds.isEmpty()) {
            mplList.addAll(marketplaceListingRepo.findByAppUserUsernameAndTitleContainingIgnoreCase(userService.getCurrentUsername(), keyword.get()));
            // category name
            mplList.addAll(marketplaceListingRepo.findByAppUserUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(userService.getCurrentUsername(), keyword.get()));
        }

        if (mplList.isEmpty()) {
            throw new NoMarketplaceListingException("No marketplace Listings found under keyword search");
        }

        List<MarketplaceListing> mplList2 = new ArrayList<>();
        mplList2.addAll(mplList);

        return mplList2;
    }

    // buyer searches by cat and/or listing title
    // search by cat id(s) AND/OR keyword for listing title/cat name
    @Override
    public List<MarketplaceListing> searchMarketplaceListings(Optional<Long[]> cIds, Optional<String> keyword, Optional<Boolean> isDeadstock) {

        Set<MarketplaceListing> mplList = new HashSet<>();
        // get both DS and MPL
        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndMarketplaceListingStatusInAndIsAvailableTrue(ids, Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        } else if (keyword.isPresent() && cIds.isEmpty()) {
            mplList.addAll(marketplaceListingRepo.findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrue(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrue(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        } else if (keyword.isPresent() && cIds.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrue(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrue(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        }
        List<MarketplaceListing> mplList2 = new ArrayList<>();
        mplList2.addAll(mplList);
        if (isDeadstock.isEmpty()) {
            return mplList2;
        } else {
            List<MarketplaceListing> filtered = new ArrayList<>();
            if (isDeadstock.get()) {
                for (MarketplaceListing m : mplList2) {
                    if (m.isDeadstock()) {
                        filtered.add(m);
                    }
                }
            } else {
                for (MarketplaceListing m : mplList2) {
                    if (!m.isDeadstock()) {
                        filtered.add(m);
                    }
                }
            }
            return filtered;
        }

//        if (cIds.isPresent() && keyword.isEmpty()) {
//            List<Long> ids = Arrays.asList(cIds.get());
//            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(ids, Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
//
//        } else if (keyword.isPresent() && cIds.isEmpty()) {
//            mplList.addAll(marketplaceListingRepo.findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
//            mplList.addAll(marketplaceListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
//        } else if (keyword.isPresent() && cIds.isPresent()) {
//            List<Long> ids = Arrays.asList(cIds.get());
//            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
//            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
//        }
    }

    // buyer searches by cat and/or deadstock title
    // search by cat id(s) AND/OR keyword for listing title/cat name
    @Override
    public List<MarketplaceListing> searchDeadstocks(Optional<Long[]> cIds, Optional<String> keyword) {

        Set<MarketplaceListing> mplList = new HashSet<>();
        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(ids, Arrays.asList(MarketplaceListingStatus.PUBLISHED)));

        } else if (keyword.isPresent() && cIds.isEmpty()) {
            mplList.addAll(marketplaceListingRepo.findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        } else if (keyword.isPresent() && cIds.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        }
        List<MarketplaceListing> mplList2 = new ArrayList<>();
        mplList2.addAll(mplList);

        return mplList2;
    }

    // admin searches for mpls
    @Override
    public List<MarketplaceListing> searchAllMarketplaceListings(Optional<Long[]> cIds, Optional<String> keyword) {

        Set<MarketplaceListing> mplList = new HashSet<>();

        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndMarketplaceListingStatusInAndIsDeadstockFalse(ids, Arrays.asList(MarketplaceListingStatus.PUBLISHED)));

        } else if (keyword.isPresent() && cIds.isEmpty()) {
            mplList.addAll(marketplaceListingRepo.findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockFalse(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockFalse(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        } else if (keyword.isPresent() && cIds.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockFalse(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockFalse(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        }

        List<MarketplaceListing> mplList2 = new ArrayList<>();
        mplList2.addAll(mplList);

        return mplList2;
    }

    // admin searches for deadstocks
    @Override
    public List<MarketplaceListing> searchAllDeadstocks(Optional<Long[]> cIds, Optional<String> keyword) {

        Set<MarketplaceListing> mplList = new HashSet<>();

        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndMarketplaceListingStatusInAndIsDeadstockTrue(ids, Arrays.asList(MarketplaceListingStatus.PUBLISHED)));

        } else if (keyword.isPresent() && cIds.isEmpty()) {
            mplList.addAll(marketplaceListingRepo.findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrue(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrue(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        } else if (keyword.isPresent() && cIds.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrue(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrue(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        }
        List<MarketplaceListing> mplList2 = new ArrayList<>();
        mplList2.addAll(mplList);

        return mplList2;
    }

    @Override
    public List<MarketplaceListing> searchAvailableDeadstocks(Optional<Long[]> cIds, Optional<String> keyword) {

        Set<MarketplaceListing> mplList = new HashSet<>();

        if (cIds.isPresent() && keyword.isEmpty()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(ids, Arrays.asList(MarketplaceListingStatus.PUBLISHED)));

        } else if (keyword.isPresent() && cIds.isEmpty()) {
            mplList.addAll(marketplaceListingRepo.findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        } else if (keyword.isPresent() && cIds.isPresent()) {
            List<Long> ids = Arrays.asList(cIds.get());
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
            mplList.addAll(marketplaceListingRepo.findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(ids, keyword.get(), Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        }
        List<MarketplaceListing> mplList2 = new ArrayList<>();
        mplList2.addAll(mplList);

        return mplList2;
    }

    // search for other users' mpls
    // search by keyword for listing title/cat name
    @Override
    public List<MarketplaceListing> searchMarketplaceListingsByUser(String username, Optional<String> keyword) {
        Set<MarketplaceListing> mplList = new HashSet<>();
        if (keyword.isEmpty()) {
            mplList.addAll(marketplaceListingRepo.findByAppUserUsernameAndMarketplaceListingStatusInAndIsAvailableTrue(username, Arrays.asList(MarketplaceListingStatus.PUBLISHED)));
        } else {
            mplList.addAll(marketplaceListingRepo.findByAppUserUsernameAndMarketplaceListingStatusInAndTitleContainingIgnoreCaseAndIsAvailableTrue(username, Arrays.asList(MarketplaceListingStatus.PUBLISHED), keyword.get()));
            // category name
            mplList.addAll(marketplaceListingRepo.findByAppUserUsernameAndMarketplaceListingStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(username, Arrays.asList(MarketplaceListingStatus.PUBLISHED), keyword.get()));
        }
        List<MarketplaceListing> mplList2 = new ArrayList<>();
        mplList2.addAll(mplList);

        return mplList2;
    }

    @Override
    public List<MarketplaceListing> retrieveOwnMarketplaceListings() throws NoMarketplaceListingException {

        List<MarketplaceListing> mplList = marketplaceListingRepo.findByAppUserUsernameAndIsAvailableTrue(userService.getCurrentUsername());

        if (mplList.isEmpty()) {
            throw new NoMarketplaceListingException("You do not have any marketplace listings.");
        }
        return mplList;
    }

    @Override
    public List<MarketplaceListing> retrieveMarketplaceListingsByUsername(String username) throws NoMarketplaceListingException {

        Optional<AppUser> curr = Optional.ofNullable(appUserRepo.findByUsername(username));
        if (curr.isEmpty()) {
            throw new UserDoesNotExistException("User with username: " + username + " cannot be found.");
        }

        List<MarketplaceListing> mplList = marketplaceListingRepo.findByAppUserUsernameAndIsAvailableTrue(curr.get().getUsername());

        if (mplList.isEmpty()) {
            throw new NoMarketplaceListingException("This user: " + username + " does not have any marketplace listings.");
        }
        return mplList;
    }

    // only published and available mpls are retrieved
    @Override
    public List<MarketplaceListing> retrieveAllMarketplaceListings(Optional<Boolean> isDeadstock) {
        List<MarketplaceListing> mplList = new ArrayList<>();
        if (isDeadstock.isEmpty()) {
            mplList = marketplaceListingRepo.findByMarketplaceListingStatusInAndIsAvailableTrue(Arrays.asList(MarketplaceListingStatus.PUBLISHED));
        } else {
            if (!isDeadstock.get()) {
                mplList = marketplaceListingRepo.findByMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(Arrays.asList(MarketplaceListingStatus.PUBLISHED));
            } else {
                mplList = marketplaceListingRepo.findByMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(Arrays.asList(MarketplaceListingStatus.PUBLISHED));
            }
        }
        return mplList;
    }

    // only published and available deadstocks are retrieved
    @Override
    public List<MarketplaceListing> retrieveDeadstocks() {

        List<MarketplaceListing> mplList = marketplaceListingRepo.findByMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(Arrays.asList(MarketplaceListingStatus.PUBLISHED));
        return mplList;
    }

    // only published listings retrieved
    @Override
    public List<MarketplaceListing> retrieveAllMarketplaceListings2() {

        List<MarketplaceListing> mplList = marketplaceListingRepo.findByMarketplaceListingStatusInAndIsDeadstockFalse(Arrays.asList(MarketplaceListingStatus.PUBLISHED));
        return mplList;
    }

    // only deadstocks retrieved
    @Override
    public List<MarketplaceListing> retrieveAllDeadstocks() {
        List<MarketplaceListing> mplList = marketplaceListingRepo.findByMarketplaceListingStatusInAndIsDeadstockTrue(Arrays.asList(MarketplaceListingStatus.PUBLISHED));
        return mplList;
    }

    @Override
    public List<MarketplaceListing> retrieveAllAvailableDeadstocks() {
        List<MarketplaceListing> mplList = marketplaceListingRepo.findByMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(Arrays.asList(MarketplaceListingStatus.PUBLISHED));
        return mplList;
    }

    @Override
    public MarketplaceListing retrieveMarketplaceListingByOrderId(Long id) throws OrderNotFoundException, OfferNotFoundException, NoAccessRightsException {
        Order2 order = order2Service.retrieveOrderById(id);
        Optional<Offer> offer = offerRepo.findById(order.getOfferId());

        if (offer.isEmpty()) {
            log.info("Offer does not exist.");
            throw new OfferNotFoundException("Offer not found, id: " + id);
        } else {
            Offer offer1 = offer.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(offer1.getRefashioneeUsername());
            AppUser refashioner = offer1.getAppUser();

            if (loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                return offer1.getMarketplaceListing();
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public MarketplaceListing updateMarketplaceListing(MarketplaceListing newMpl) throws MarketplaceListingNotFoundException, NoAccessRightsException {
        Optional<MarketplaceListing> mplOpt = marketplaceListingRepo.findById(newMpl.getId());
        if (mplOpt.isEmpty()) {
            throw new MarketplaceListingNotFoundException("Marketplace listing with id: " + newMpl.getId() + " not found!");
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            MarketplaceListing mpl = mplOpt.get();

            if (appUser.getMarketplaceListings().contains(mpl) || mpl.getAppUser().equals(appUser) || appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                mpl.setTitle(newMpl.getTitle());
                mpl.setDescription(newMpl.getDescription());
                mpl.setPrice(newMpl.getPrice());
                mpl.setImageList(newMpl.getImageList());

                marketplaceListingRepo.save(mpl);
                return mpl;
            }
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public void deleteMarketplaceListing(Long id) throws MarketplaceListingNotFoundException, NoAccessRightsException {
        Optional<MarketplaceListing> mplOpt = marketplaceListingRepo.findById(id);
        if (mplOpt.isEmpty()) {
            throw new MarketplaceListingNotFoundException("Marketplace listing with id: " + id + " not found!");
        } else {
            MarketplaceListing mplToDelete = mplOpt.get();

            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            AppUser mplCreator = mplToDelete.getAppUser();

            if (user.equals(mplCreator) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                mplToDelete.setAvailable(false);
                marketplaceListingRepo.saveAndFlush(mplToDelete);
//                marketplaceListingRepo.delete(mplToDelete);
//                marketplaceListingRepo.flush();
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public void favouriteMarketplaceListing(Long id) throws MarketplaceListingNotFoundException, MarketplaceListingAlreadyFavouritedException {
        Optional<MarketplaceListing> marketplaceListing = marketplaceListingRepo.findById(id);
        if (marketplaceListing.isEmpty()) {
            throw new MarketplaceListingNotFoundException(("Marketplace Listing with id: " + id + " cannot be found."));
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            List<MarketplaceListing> marketplaceListings = appUser.getMarketplaceListingFavourites();

            if (marketplaceListings.contains(marketplaceListing.get())) {
                throw new MarketplaceListingAlreadyFavouritedException("This marketplace listing with the id: " + id + " already exists in your favourites.");
            } else {
                marketplaceListings.add(marketplaceListing.get());
                appUser.setMarketplaceListingFavourites(marketplaceListings);
                appUserRepo.save(appUser);
            }
        }
    }

    @Override
    public void unfavouriteMarketplaceListing(Long id) throws MarketplaceListingNotFoundException, FavouriteNotFoundException {
        Optional<MarketplaceListing> marketplaceListing = marketplaceListingRepo.findById(id);
        if (marketplaceListing.isEmpty()) {
            throw new MarketplaceListingNotFoundException(("Marketplace Listing with id: " + id + " cannot be found."));
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            List<MarketplaceListing> marketplaceListings = appUser.getMarketplaceListingFavourites();
            if (!marketplaceListings.contains(marketplaceListing.get())) {
                throw new FavouriteNotFoundException("This marketplace listing with the id: " + id + " does not exist in your favourites.");
            } else {
                marketplaceListings.remove(marketplaceListing.get());
                appUser.setMarketplaceListingFavourites(marketplaceListings);
                appUserRepo.save(appUser);
            }
        }
    }

    @Override
    public List<MarketplaceListing> retrieveFavouritedMarketplaceListings() {
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
        List<MarketplaceListing> marketplaceListings = appUser.getMarketplaceListingFavourites();
        return marketplaceListings;
    }

    @Override
    public List<Offer> retrieveOffersForMpl(Long mplId) throws MarketplaceListingNotFoundException {
        MarketplaceListing mpl = retrieveMarketplaceListingById(mplId);
        return mpl.getOffers();
    }

//    @Override
//    public MarketplaceListing saveMarketplaceListingAsDraft(MarketplaceListing marketplaceListing) throws MarketplaceListingNotFoundException, MarketplaceListingSubmittedAlreadyException, NoAccessRightsException {
//        Optional<MarketplaceListing> marketplaceListingOptional = marketplaceListingRepo.findById(marketplaceListing.getId());
//
//        if (marketplaceListingOptional.isEmpty()) {
//            throw new MarketplaceListingNotFoundException("Marketplace listing with ID: " + marketplaceListing.getId() + " not found!");
//        } else if (marketplaceListingOptional.get().getMarketplaceListingStatus() == MarketplaceListingStatus.PUBLISHED) {
//            throw new MarketplaceListingSubmittedAlreadyException("Marketplace listing with ID: " + marketplaceListingOptional.get().getId() + " is published already!");
//        } else {
//            MarketplaceListing mpl = marketplaceListingOptional.get();
//
//            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
//            if (appUser.getMarketplaceListings().contains(mpl) || mpl.getAppUser().equals(appUser) || appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//                mpl.setTitle(marketplaceListing.getTitle());
//                mpl.setDescription(marketplaceListing.getDescription());
//                mpl.setPrice(marketplaceListing.getPrice());
//                mpl.setMarketplaceListingStatus(MarketplaceListingStatus.DRAFT);
//                mpl.setImageList(marketplaceListing.getImageList());
//
//                marketplaceListingRepo.save(mpl);
//                marketplaceListingRepo.flush();
//
//                return mpl;
//            }
//            throw new NoAccessRightsException("You do not have the access rights to do this method!");
//        }
//    }
}
