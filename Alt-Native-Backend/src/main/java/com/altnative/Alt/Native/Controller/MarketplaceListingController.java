package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.FavouriteNotFoundException;
import com.altnative.Alt.Native.Exceptions.MarketplaceListingAlreadyFavouritedException;
import com.altnative.Alt.Native.Exceptions.MarketplaceListingNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoMarketplaceListingException;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.MarketplaceListing;
import com.altnative.Alt.Native.Model.ProjectRequest;
import com.altnative.Alt.Native.Service.MarketplaceListingService;
import com.amazonaws.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.yaml.snakeyaml.error.Mark;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class MarketplaceListingController {
    private final MarketplaceListingService marketplaceListingService;

    // user clicks on Publish
    @PostMapping("/publishMarketplaceListings")
    public ResponseEntity<?> publishMarketplaceListing(@RequestParam Optional<Long> cId, @RequestParam Optional<Long> mId, @Valid @RequestPart MarketplaceListing marketplaceListing, @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/publishMarketplaceListings").toUriString());
        try {
            // newly created MPL
            if (mId.isEmpty()) {
                return ResponseEntity.ok().body(marketplaceListingService.createNewMarketplaceListing(cId.get(), marketplaceListing, files));
                // MPL exists as draft
            } else {
                return ResponseEntity.ok().body(marketplaceListingService.submitMarketplaceListingInDraft(mId.get(), marketplaceListing));
            }

        } catch (CategoryNotFoundException | MarketplaceListingSubmittedAlreadyException | MarketplaceListingNotFoundException | NoAccessRightsException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // user clicks on Save
    @PostMapping("/saveMarketplaceListings")
    public ResponseEntity<?> saveMarketplaceListing(@RequestParam Optional<Long> mId, @RequestParam Optional<Long> cId, @Valid @RequestPart MarketplaceListing marketplaceListing, @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/saveMarketplaceListings").toUriString());
        try {
            // newly created MPL
            if (mId.isEmpty()) {
                return ResponseEntity.ok().body(marketplaceListingService.createMarketplaceListingAsDraft(cId.get(), marketplaceListing, files));
                // mpl exists as draft
            } else {
                return ResponseEntity.ok().body(marketplaceListingService.editMarketplaceListingInDraft(mId.get(), marketplaceListing));
            }

        } catch (CategoryNotFoundException | MarketplaceListingNotFoundException | NoAccessRightsException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/marketplaceListing/{id}/update")
    public ResponseEntity<?> updateMarketplaceListing(@PathVariable Long id, @Valid @RequestPart MarketplaceListing mpl) {
        try {
            return ResponseEntity.ok().body(marketplaceListingService.editMarketplaceListingInDraft(id, mpl));
        } catch (MarketplaceListingNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/categories/{cId}/createMarketplaceListing")
    public ResponseEntity<?> createNewMarketplaceListing(@PathVariable Long cId, @Valid @RequestPart MarketplaceListing marketplaceListing, @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/marketplaceListing/createNewMarketplaceListing").toUriString());
        try {
            return ResponseEntity.created(uri).body(marketplaceListingService.createNewMarketplaceListing(cId, marketplaceListing, files));
        } catch (CategoryNotFoundException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/marketplaceListing/{marketplaceListingId}")
    public ResponseEntity<?> addImageToMarketplaceListing(@PathVariable Long marketplaceListingId, @RequestPart(value = "file", required = true) MultipartFile file) {
        try {
            marketplaceListingService.addImageToMarketplaceListing(marketplaceListingId, file);
            return ResponseEntity.ok().build();
        } catch (MarketplaceListingNotFoundException | InvalidFileException | S3Exception | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/marketplaceListing/{marketplaceListingId}/image/{imageId}")
    public ResponseEntity<?> removeImageFromMarketplaceListing(@PathVariable Long marketplaceListingId, @PathVariable Long imageId) {
        try {
            marketplaceListingService.removeImageFromMarketplaceListing(marketplaceListingId, imageId);
            return ResponseEntity.ok().build();
        } catch (NoAccessRightsException | MarketplaceListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/marketplaceListings/{id}")
    public ResponseEntity<?> retrieveMarketplaceListingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(marketplaceListingService.retrieveMarketplaceListingById(id));
        } catch (MarketplaceListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/marketplaceListings/{mplId}/offers")
    public ResponseEntity<?> retrieveOffersForMPL(@PathVariable Long mplId) {
        try {
            return ResponseEntity.ok().body(marketplaceListingService.retrieveOffersForMpl(mplId));
        } catch (MarketplaceListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // seller searches for own listings
    // search by selection of categories OR input keyword
    // if no search query is given, retrieve all user's listings
    @GetMapping("/myMarketplaceListings/search")
    public ResponseEntity<?> searchOwnMarketplaceListings(@RequestParam Optional<Long[]> cIds,
                                                          @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (cIds.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(marketplaceListingService.retrieveOwnMarketplaceListings());
            } else {
                response = ResponseEntity.ok().body(marketplaceListingService.searchOwnMarketplaceListings(cIds, keyword));
            }
        } catch (NoMarketplaceListingException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    // search by selection of categories OR input keyword for listing title
    // if no search query is given, retrieve all marketplace listings
    @GetMapping("/marketplaceListings/search")
    public ResponseEntity<?> searchMarketplaceListings(@RequestParam Optional<Long[]> cIds,
                                                       @RequestParam Optional<String> keyword,
                                                       @RequestParam Optional<Boolean> isDeadstock) {
        ResponseEntity<?> response = null;
        if (cIds.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(marketplaceListingService.retrieveAllMarketplaceListings(isDeadstock));
        } else {
            response = ResponseEntity.ok().body(marketplaceListingService.searchMarketplaceListings(cIds, keyword, isDeadstock));
        }
        return response;
    }

    // search by selection of categories OR input keyword for dead title
    // if no search query is given, retrieve all dead
    @GetMapping("/deadstocks/search")
    public ResponseEntity<?> searchDeadstocks(@RequestParam Optional<Long[]> cIds,
                                              @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        if (cIds.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(marketplaceListingService.retrieveDeadstocks());
        } else {
            response = ResponseEntity.ok().body(marketplaceListingService.searchDeadstocks(cIds, keyword));
        }
        return response;
    }

    // admin
    // mpls
    @GetMapping("/allMarketplaceListings/search")
    public ResponseEntity<?> searchAllMarketplaceListings(@RequestParam Optional<Long[]> cIds,
                                                          @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        if (cIds.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(marketplaceListingService.retrieveAllMarketplaceListings2());
        } else {
            response = ResponseEntity.ok().body(marketplaceListingService.searchAllMarketplaceListings(cIds, keyword));
        }

        return response;
    }

    // admin
    // deadstocks
    @GetMapping("/allDeadstocks/search")
    public ResponseEntity<?> searchAllDeadstocks(@RequestParam Optional<Long[]> cIds,
                                                 @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        if (cIds.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(marketplaceListingService.retrieveAllDeadstocks());
        } else {
            response = ResponseEntity.ok().body(marketplaceListingService.searchAllDeadstocks(cIds, keyword));
        }
        return response;
    }

    @GetMapping("/availableDeadstocks/search")
    public ResponseEntity<?> searchAvailableDeadstocks(@RequestParam Optional<Long[]> cIds,
                                                       @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        if (cIds.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(marketplaceListingService.retrieveAllAvailableDeadstocks());
        } else {
            response = ResponseEntity.ok().body(marketplaceListingService.searchAvailableDeadstocks(cIds, keyword));
        }
        return response;
    }

    @PostMapping("/categories/{cId}/marketplaceListingDraft")
    public ResponseEntity<?> createMarketplaceListingDraft(@PathVariable Long cId, @RequestPart MarketplaceListing marketplaceListing, @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        try {
            return ResponseEntity.ok().body(marketplaceListingService.createMarketplaceListingAsDraft(cId, marketplaceListing, files));
        } catch (UsernameNotFoundException | CategoryNotFoundException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/marketplaceListings/drafts")
    public ResponseEntity<?> retrieveAllDrafts() {
        try {
            return ResponseEntity.ok().body(marketplaceListingService.retrieveAllDraftMarketplaceListings());
        } catch (NoMarketplaceListingException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/marketplaceListings/published")
    public ResponseEntity<?> retrieveAllPublished() {
        try {
            return ResponseEntity.ok().body(marketplaceListingService.retrievePublishedMarketplaceListings());
        } catch (NoMarketplaceListingException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // retrieves mpl
    @GetMapping("/orders/{id}/marketplaceListings")
    public ResponseEntity<?> retrieveMarketplaceListingByOrderId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(marketplaceListingService.retrieveMarketplaceListingByOrderId(id));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

//    @GetMapping("/marketplaceListings")
//    public ResponseEntity<?> retrieveAllMarketplaceListings() {
//        try {
//            return ResponseEntity.ok().body(marketplaceListingService.retrieveAllMarketplaceListings());
//        } catch (NoMarketplaceListingException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    @GetMapping("/marketplaceListings/user/{username}")
    public ResponseEntity<?> retrieveAllMarketplaceListingsByUsername(@PathVariable String username) {
        try {
            return ResponseEntity.ok().body(marketplaceListingService.retrieveMarketplaceListingsByUsername(username));
        } catch (NoMarketplaceListingException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/marketplaceListing/deleteById/{id}")
    public ResponseEntity<?> deleteMarketplaceListingById(@PathVariable Long id) throws MarketplaceListingNotFoundException {
        try {
            marketplaceListingService.deleteMarketplaceListing(id);
            return ResponseEntity.ok().body("Marketplace listing with id: " + id + " deleted successfully");
        } catch (MarketplaceListingNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    //TO TEST: OKAY
    @PostMapping("/marketplaceListing/favourite/{id}")
    public ResponseEntity<?> favouriteMarketplaceListingById(@PathVariable Long id) throws MarketplaceListingNotFoundException, MarketplaceListingAlreadyFavouritedException {
        try {
            marketplaceListingService.favouriteMarketplaceListing(id);
            return ResponseEntity.ok().body("Marketplace listing with id: " + id + " favourited successfully");
        } catch (MarketplaceListingNotFoundException | MarketplaceListingAlreadyFavouritedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    //TO TEST: OKAY
    @PostMapping("/marketplaceListing/unfavourite/{id}")
    public ResponseEntity<?> unfavouriteMarketplaceListingById(@PathVariable Long id) throws MarketplaceListingNotFoundException, FavouriteNotFoundException {
        try {
            marketplaceListingService.unfavouriteMarketplaceListing(id);
            return ResponseEntity.ok().body("Marketplace listing with id: " + id + " unfavourited successfully");
        } catch (MarketplaceListingNotFoundException | FavouriteNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    //TO TEST: OKAY
    @GetMapping("/marketplaceListing/favourites")
    public ResponseEntity<?> retrieveFavouritedMarketplaceListings() {
        return ResponseEntity.ok().body(marketplaceListingService.retrieveFavouritedMarketplaceListings());
    }

    // users search for other users' mpls
    @GetMapping("/marketplaceListings/username/{username}")
    public ResponseEntity<?> retrieveMarketplaceListingsByUsername(@PathVariable String username,
                                                                   @RequestParam Optional<String> keyword) {
        return ResponseEntity.ok().body(marketplaceListingService.searchMarketplaceListingsByUser(username, keyword));
    }

    //    @PutMapping("/marketplaceListing/saveDraft")
//    public ResponseEntity<?> saveMarketplaceListingAsDraft(@Valid @RequestBody MarketplaceListing marketplaceListing) {
//        try {
//            return ResponseEntity.ok().body(marketplaceListingService.saveMarketplaceListingAsDraft(marketplaceListing));
//        } catch (MarketplaceListingSubmittedAlreadyException | MarketplaceListingNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PutMapping("/marketplaceListing/editDraft")
//    public ResponseEntity<?> editMarketplaceListingDraft(@Valid @RequestBody MarketplaceListing marketplaceListing) {
//        try {
//            return ResponseEntity.ok().body(marketplaceListingService.editMarketplaceListingInDraft(marketplaceListing));
//        } catch (MarketplaceListingNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PutMapping("/marketplaceListing/submitDraft/draft/{id}")
//    public ResponseEntity<?> submitMarketplaceListingDraft(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(marketplaceListingService.submitMarketplaceListingInDraft(id));
//        } catch (MarketplaceListingSubmittedAlreadyException | MarketplaceListingNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
}
