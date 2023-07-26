package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.MarketplaceListing;
import com.altnative.Alt.Native.Model.Offer;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface MarketplaceListingService {

    MarketplaceListing createNewMarketplaceListing(Long cId, MarketplaceListing marketplaceListing, List<MultipartFile> files) throws CategoryNotFoundException, UsernameNotFoundException, InvalidFileException, S3Exception;

    MarketplaceListing createMarketplaceListingAsDraft(Long cId, MarketplaceListing marketplaceListing, List<MultipartFile> files) throws UsernameNotFoundException, CategoryNotFoundException, InvalidFileException, S3Exception;

    MarketplaceListing editMarketplaceListingInDraft(Long id, MarketplaceListing newMpl) throws MarketplaceListingNotFoundException, NoAccessRightsException;

    void addImageToMarketplaceListing(Long marketplaceListingId, MultipartFile file) throws MarketplaceListingNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException;

    void removeImageFromMarketplaceListing(Long marketplaceListingId, Long imageId) throws MarketplaceListingNotFoundException, NoAccessRightsException;

    MarketplaceListing submitMarketplaceListingInDraft(Long marketplaceListingId, MarketplaceListing mpl) throws MarketplaceListingNotFoundException, MarketplaceListingSubmittedAlreadyException, NoAccessRightsException;

    List<MarketplaceListing> retrieveAllDraftMarketplaceListings() throws NoMarketplaceListingException;

    List<MarketplaceListing> retrievePublishedMarketplaceListings() throws NoMarketplaceListingException;

    MarketplaceListing retrieveMarketplaceListingById(Long id) throws MarketplaceListingNotFoundException;

    List<MarketplaceListing> searchOwnMarketplaceListings(Optional<Long[]> cIds, Optional<String> keyword) throws NoMarketplaceListingException;

    List<MarketplaceListing> retrieveOwnMarketplaceListings() throws NoMarketplaceListingException;

    List<MarketplaceListing> searchMarketplaceListings(Optional<Long[]> cIds, Optional<String> keyword, Optional<Boolean> isDeadstock);

    List<MarketplaceListing> searchAllMarketplaceListings(Optional<Long[]> cIds, Optional<String> keyword);

    List<MarketplaceListing> retrieveMarketplaceListingsByUsername(String username) throws NoMarketplaceListingException;

    List<MarketplaceListing> retrieveAllMarketplaceListings(Optional<Boolean> isDeadstock);

    List<MarketplaceListing> retrieveAllMarketplaceListings2();

    List<MarketplaceListing> retrieveAllAvailableDeadstocks();

    MarketplaceListing retrieveMarketplaceListingByOrderId(Long id) throws OrderNotFoundException, OfferNotFoundException, NoAccessRightsException;

    MarketplaceListing updateMarketplaceListing(MarketplaceListing newMpl) throws MarketplaceListingNotFoundException, NoAccessRightsException;

    void deleteMarketplaceListing(Long id) throws MarketplaceListingNotFoundException, NoAccessRightsException;

    void favouriteMarketplaceListing(Long id) throws MarketplaceListingNotFoundException, MarketplaceListingAlreadyFavouritedException;

    void unfavouriteMarketplaceListing(Long id) throws MarketplaceListingNotFoundException, FavouriteNotFoundException;

    List<MarketplaceListing> retrieveFavouritedMarketplaceListings();

    List<Offer> retrieveOffersForMpl(Long mplId) throws MarketplaceListingNotFoundException;

    List<MarketplaceListing> searchAvailableDeadstocks(Optional<Long[]> cIds, Optional<String> keyword);

    List<MarketplaceListing> searchMarketplaceListingsByUser(String username, Optional<String> keyword);

    List<MarketplaceListing> searchAllDeadstocks(Optional<Long[]> cIds, Optional<String> keyword);

    List<MarketplaceListing> retrieveAllDeadstocks();

    List<MarketplaceListing> retrieveDeadstocks();

    List<MarketplaceListing> searchDeadstocks(Optional<Long[]> cIds, Optional<String> keyword);
}
