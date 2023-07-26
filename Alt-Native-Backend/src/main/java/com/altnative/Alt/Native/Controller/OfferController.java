package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Offer;
import com.altnative.Alt.Native.Model.Order2;
import com.altnative.Alt.Native.Service.OfferService;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class OfferController {

    private final OfferService offerService;

//    @PostMapping("/projects/{projectId}/offers")
//    public ResponseEntity<?> createOffer(@PathVariable Long projectId, @RequestBody Offer offer) {
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projects/{projectId}/offers").toUriString());
//        try {
//            return ResponseEntity.created(uri).body(offerService.createOffer(projectId, offer));
//        } catch (InvalidOfferException | ProjectListingNotFoundException | UsernameNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    @PostMapping("/projectListings/{projectId}/offers")
    public ResponseEntity<?> createOfferForProjectListing(@PathVariable Long projectId, @Valid @RequestBody Offer offer) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectListings/{projectId}/offers").toUriString());
        try {
            System.out.println("deleted");
            return ResponseEntity.created(uri).body(offerService.createOfferForProjectListing(projectId, offer));
        } catch (InvalidOfferException | ProjectListingNotFoundException | UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/events/{eventId}/offers")
    public ResponseEntity<?> createOfferForEvent(@PathVariable Long eventId, @Valid @RequestBody Integer quantity) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/events/{eventId}/offers").toUriString());
        try {
            return ResponseEntity.created(uri).body(offerService.createOfferForEvent(eventId, quantity));
        } catch (InvalidOfferException | UsernameNotFoundException | NoAccessRightsException | EventNotFoundException | OfferNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/projectRequests/{reqId}/offers")
    public ResponseEntity<?> createOfferForProjectReq(@PathVariable Long reqId, @Valid @RequestBody Offer offer) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectRequests/{reqId}/offers").toUriString());
        try {
            return ResponseEntity.created(uri).body(offerService.createOfferForProjectReq(reqId, offer));
        } catch (InvalidOfferException | ProjectRequestNotFoundException | UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/order/{orderId}/addOnOffer")
    public ResponseEntity<?> createOfferForAddOnProjectRequest(@PathVariable Long orderId, @RequestBody Offer offer) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectRequests/{reqId}/addOnOffer").toUriString());
        try {
            return ResponseEntity.created(uri).body(offerService.createOfferForAddOnOrder(offer, orderId));
        } catch (OrderNotFoundException | OfferNotFoundException |ProjectRequestNotFoundException | UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/order/delivery/{deliveryId}")
    public ResponseEntity<?> createOfferForDelivery(@PathVariable Long deliveryId) {
        try {
            return ResponseEntity.ok().body(offerService.createOfferForDelivery(deliveryId));
        } catch (NoAccessRightsException | OrderNotFoundException | OfferNotFoundException | DeliveryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapItem/delivery/{deliveryId}")
    public ResponseEntity<?> createOfferForSwapItemDelivery(@PathVariable Long deliveryId) {
        try {
            return ResponseEntity.ok().body(offerService.createOfferForSwapItemDelivery(deliveryId));
        } catch (NoAccessRightsException | DeliveryNotFoundException | ItemNotFoundException | OrderNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/marketplaceListing/{mplId}/makeOffer")
    public ResponseEntity<?> createOfferForMPL(@PathVariable Long mplId, @RequestBody CreateMplForm mplForm) {
        try {
            return ResponseEntity.ok().body(offerService.createOfferForMPL(mplId, mplForm.getQuantity(), mplForm.getBuyer()));
        } catch (MarketplaceListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // refashioners search for his own offers
    // search by selection of statuses and/or input keyword
    @GetMapping("/myOffers/search")
    public ResponseEntity<?> searchOwnOffers(@RequestParam Optional<String[]> statuses,
                                                      @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (statuses.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(offerService.retrieveOwnOffers());
            } else {
                response = ResponseEntity.ok().body(offerService.searchOwnOffers(statuses, keyword));
            }
        } catch (OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    @GetMapping("/appUsers/{username}/offers")
    public ResponseEntity<?> retrieveOffersByUsername(@PathVariable String username) {
        try {
            return ResponseEntity.ok().body(offerService.retrieveOffersByUsername(username));
        } catch (UsernameNotFoundException | OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/projectListings/{projectId}/offers")
    public ResponseEntity<?> retrieveOffersByProjectId(@PathVariable Long projectId) {
        try {
            return ResponseEntity.ok().body(offerService.retrieveOffersByProjectId(projectId));
        } catch (ProjectListingNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/projectRequests/{reqId}/offers")
    public ResponseEntity<?> retrieveOfferByReqId(@PathVariable Long reqId) {
        try {
            return ResponseEntity.ok().body(offerService.retrieveOffersByReqId(reqId));
        } catch (ProjectRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/events/offers/{offerId}")
    public ResponseEntity<?> retrieveEventOfferById(@PathVariable Long offerId) {
        try {
            return ResponseEntity.ok().body(offerService.retrieveEventOfferByOfferId(offerId));
        } catch (NoAccessRightsException | OfferNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/offers/{id}")
    public ResponseEntity<?> retrieveOfferById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(offerService.retrieveOfferById(id));
        } catch (OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/projectRequests/{reqId}/offers/{id}")
    public ResponseEntity<?> deleteOfferForProjectReq(@PathVariable Long id) {
        try {
            offerService.deleteOfferForProjectReq(id);
            return ResponseEntity.ok().body("Offer with ID: " + id + " deleted successfully.");
        } catch (OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/offers/delete/{id}")
    public ResponseEntity<?> deleteOfferForProjectListing(@PathVariable Long id) {
        try {
            System.out.println("deleted");
            offerService.deleteOfferForProjectListing(id);
            return ResponseEntity.ok().body("Offer with ID: " + id + " deleted successfully.");
        } catch (OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/offers/{offerId}/accept")
    public ResponseEntity<?> acceptOfferForProjectListing(@PathVariable Long offerId) {
        try {
            return ResponseEntity.ok().body(offerService.acceptOffer(offerId));
        } catch (OfferNotFoundException | OfferAlreadyAcceptedException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
//
//    @PostMapping("/offers/{offerId}/mplAccept")
//    public ResponseEntity<?> acceptOfferForMPL(@PathVariable Long offerId) {
//        try {
//            return ResponseEntity.ok().body(offerService.acceptOfferAll(offerId));
//        } catch (OfferAlreadyAcceptedException | OfferNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    @PostMapping("/offers/{offerId}/reject")
    public ResponseEntity<?> rejectOfferForProjectListing(@PathVariable Long offerId, @RequestBody Optional<String> reason) {
        try {
            return ResponseEntity.ok().body(offerService.rejectOffer(offerId, reason));
        } catch (OfferNotFoundException | OfferAlreadyAcceptedException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/orders/{orderId}/addOn/{addOnOfferId}/reject")
    public ResponseEntity<?> rejectAddOnOffer(@PathVariable Long addOnOfferId, @PathVariable Long orderId, @RequestBody Optional<String> reason) {
        try {
            return ResponseEntity.ok().body(offerService.rejectAddOnOffer(addOnOfferId, reason, orderId));
        } catch (OfferAlreadyAcceptedException | OrderNotFoundException | NoAccessRightsException | OfferNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/offers/{offerId}/newTransaction")
    public ResponseEntity<?> createNewTransactionForOffer(@PathVariable Long offerId) {
        try {
            return ResponseEntity.ok().body(offerService.createNewTransactionForOffer(offerId));
        } catch (OfferNotFoundException | OrderAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/events/offers/{offerId}/accept")
    public ResponseEntity<?> acceptEventsOffer(@PathVariable Long offerId) {
        try {
            return ResponseEntity.ok().body(offerService.acceptEventOffer(offerId));
        } catch (OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/offers")
    public ResponseEntity<List<Offer>> retrieveAllOffers() throws OfferNotFoundException {
        return ResponseEntity.ok().body(offerService.retrieveAllOffers());
    }
}

@Data
@NoArgsConstructor
class CreateMplForm {
    private String buyer;
    private Integer quantity;
}

