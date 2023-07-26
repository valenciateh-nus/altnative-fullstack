package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Offer;
import com.altnative.Alt.Native.Model.Project;
import com.altnative.Alt.Native.Model.ProjectRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

public interface OfferService {

    Offer createOfferForProjectListing(Long projectId, Offer offer) throws InvalidOfferException, ProjectListingNotFoundException, UsernameNotFoundException, NoAccessRightsException;

    Offer createOfferForProjectReq(Long reqId, Offer offer) throws InvalidOfferException, ProjectRequestNotFoundException, UsernameNotFoundException, NoAccessRightsException;

//    Offer createOfferForSwapRequest(Long reqId, Offer offer) throws InvalidOfferException, SwapRequestNotFoundException, UsernameNotFoundException, NoAccessRightsException, ProjectRequestNotFoundException;

    Offer createOfferForEvent(Long eventId, Integer quantity) throws InvalidOfferException, EventNotFoundException, UsernameNotFoundException, NoAccessRightsException, OfferNotFoundException;

    List<Offer> retrieveOffersByProjectId(Long projectId) throws ProjectListingNotFoundException, NoAccessRightsException;

    List<Offer> retrieveOffersByReqId(Long reqId) throws ProjectRequestNotFoundException, NoAccessRightsException;

    List<Offer> retrieveOffersByUsername(String username) throws UsernameNotFoundException, OfferNotFoundException, NoAccessRightsException;

    List<Offer> retrieveAllOffers() throws OfferNotFoundException;

    List<Offer> searchOwnOffers(Optional<String[]> statuses, Optional<String> keyword) throws OfferNotFoundException;

    List<Offer> retrieveOwnOffers() throws UsernameNotFoundException, OfferNotFoundException, NoAccessRightsException;

//    Offer createOfferForAddOnProjectListing(Long projectId, Offer offer) throws InvalidOfferException, UsernameNotFoundException, NoAccessRightsException, ProjectListingNotFoundException;
//
//    Offer createOfferForAddOnProjectRequest(Long reqId, Offer offer) throws InvalidOfferException, UsernameNotFoundException, NoAccessRightsException, ProjectRequestNotFoundException;

    Offer createOfferForAddOnOrder(Offer offer, Long orderId) throws UsernameNotFoundException, NoAccessRightsException, ProjectRequestNotFoundException, OrderNotFoundException, OfferNotFoundException;

    Offer createOfferForSwapItemDelivery(Long deliveryId) throws UsernameNotFoundException, NoAccessRightsException, ItemNotFoundException, DeliveryNotFoundException, OrderNotFoundException;
//    Offer createOfferForMPL(Long marketplaceListingId, Integer quantity) throws MarketplaceListingNotFoundException;

    Offer createOfferForDelivery(Long deliveryId) throws UsernameNotFoundException, NoAccessRightsException, OrderNotFoundException, OfferNotFoundException, DeliveryNotFoundException;

    Offer createOfferForMPL(Long marketplaceListingId, Integer quantity, String buyer) throws MarketplaceListingNotFoundException;

    Offer retrieveOfferById(Long id) throws OfferNotFoundException, NoAccessRightsException;

    Offer updateOffer(Offer newOffer) throws OfferNotFoundException, NoAccessRightsException;

//    Offer acceptOfferAll(Long offerId) throws OfferNotFoundException, OfferAlreadyAcceptedException;

    Offer acceptOffer(Long offerId) throws OfferNotFoundException, OfferAlreadyAcceptedException, NoAccessRightsException;

    Offer acceptAddOnOffer(Long addOnOfferId) throws NoAccessRightsException, OfferNotFoundException;

    //can only be done by refashionee or admin
    Offer rejectOffer(Long offerId, Optional<String> reasonForDeclining) throws OfferNotFoundException, OfferAlreadyAcceptedException, NoAccessRightsException;

    //used only if you want to create milestone when an add on offer is rejected
    Offer rejectAddOnOffer(Long offerId, Optional<String> reasonForDeclining, Long orderId) throws OfferAlreadyAcceptedException, NoAccessRightsException, OfferNotFoundException, OrderNotFoundException;

    Offer createNewTransactionForOffer(Long offerId) throws OfferNotFoundException, OrderAlreadyExistsException;

    void deleteOfferForProjectReq(Long id) throws OfferNotFoundException, NoAccessRightsException;

    void deleteOfferForProjectListing(Long id) throws OfferNotFoundException, NoAccessRightsException;

    Project retrieveProjectUnderOffer(Long offerId) throws NoAccessRightsException, OfferNotFoundException;

    Offer retrieveEventOfferByOfferId(Long id) throws OfferNotFoundException, NoAccessRightsException;

    Offer acceptEventOffer(Long eventOfferId) throws OfferNotFoundException, NoAccessRightsException;

}

