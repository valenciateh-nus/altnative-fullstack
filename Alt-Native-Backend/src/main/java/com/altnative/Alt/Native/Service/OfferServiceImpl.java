package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.*;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Model.ProjectListing;
import com.altnative.Alt.Native.Repository.*;
import com.amazonaws.services.connect.model.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OfferServiceImpl implements OfferService {
    private final OfferRepo offerRepo;
    private final AppUserService appUserService;
    private final ProjectListingRepo projectListingRepo;
    private final ProjectRequestRepo projectRequestRepo;
    private final UserService userService;
    private final MarketplaceListingService marketplaceListingService;
    private final TransactionRepo transactionRepo;
    private final Order2Repo order2Repo;
    private final Order2Service order2Service;
    private final MilestoneRepo milestoneRepo;
    private final Chat2Service chat2Service;
    private final EventService eventService;
    private final SwapRequestRepo swapRequestRepo;
    private final DeliveryService deliveryService;
    private final DeliveryRepo deliveryRepo;

    @Override
    public Offer createOfferForProjectListing(Long projectId, Offer offer) throws InvalidOfferException, ProjectListingNotFoundException, UsernameNotFoundException, NoAccessRightsException {

        //(Double price, String description, Date proposedCompletionDate, Boolean status)
        Offer newOffer = new Offer(offer.getPrice(), offer.getTitle(), offer.getDescription(), offer.getProposedCompletionDate());

        // retrieve logged in user entity by id
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (user.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {

            // retrieve project listing entity by id
            ProjectListing projectListing = (ProjectListing) projectListingRepo.findById(projectId).orElseThrow(
                    () -> new ProjectListingNotFoundException("Project Listing id: " + projectId + " does not exist."));

            // set user and project listing to offer entity
            newOffer.setAppUser(user);
            newOffer.setProjectListing(projectListing);
            newOffer.setOfferStatus(OfferStatus.PENDING_RESPONSE);
            newOffer.setOfferType(OfferType.PROJECT_LISTING);
            newOffer.setRefashioneeUsername(offer.getRefashioneeUsername());
            user.getOffers().add(newOffer);
            projectListing.getOffers().add(newOffer);

            // offer entity to DB
            log.info("Saving new offer {} to db", offer.getDescription());
            offerRepo.save(newOffer);
            return newOffer;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public Offer createOfferForProjectReq(Long reqId, Offer offer) throws InvalidOfferException, ProjectRequestNotFoundException, UsernameNotFoundException, NoAccessRightsException {

        Offer newOffer = new Offer(offer.getPrice(), offer.getTitle(), offer.getDescription(), offer.getProposedCompletionDate());

        // retrieve logged in user entity by id
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (user.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
            // retrieve project request entity by id
            ProjectRequest projectRequest = (ProjectRequest) projectRequestRepo.findById(reqId).orElseThrow(
                    () -> new ProjectRequestNotFoundException("Project request id: " + reqId + " does not exist."));

            offer.setAppUser(user);
            offer.setProjectRequest(projectRequest);
            offer.setOfferStatus(OfferStatus.PENDING_RESPONSE);
            offer.setOfferType(OfferType.PROJECT_REQUEST);
            offer.setRefashioneeUsername(projectRequest.getRefashionee().getUsername());
            user.getOffers().add(offer);
            projectRequest.getOffers().add(offer);

            // offer entity to DB
            log.info("Saving new offer {} to db", offer.getDescription());
            offerRepo.save(offer);
            return offer;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public Offer createOfferForAddOnOrder(Offer offer, Long orderId) throws UsernameNotFoundException, NoAccessRightsException, ProjectRequestNotFoundException, OrderNotFoundException, OfferNotFoundException {

        Offer newOffer = new Offer(offer.getPrice(), offer.getTitle(), offer.getDescription(), offer.getProposedCompletionDate());

        // retrieve logged in user entity by id
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());

        if (loggedInUser.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
            Order2 order = order2Service.retrieveOrderById(orderId);
            Offer mainOffer = retrieveOfferById(order.getOfferId());

            newOffer.setAppUser(loggedInUser);
            if (mainOffer.getProjectRequest() == null) { //this order is for project listing
                newOffer.setProjectListing(mainOffer.getProjectListing());
            } else { //this offer is for project request
                newOffer.setProjectRequest(mainOffer.getProjectRequest());
            }
            newOffer.setAppUser(loggedInUser);
            newOffer.setOfferStatus(OfferStatus.PENDING_RESPONSE);
            newOffer.setOfferType(OfferType.ADD_ON);
            newOffer.setRefashioneeUsername(mainOffer.getRefashioneeUsername());
            newOffer.setBuyerUsername(mainOffer.getRefashioneeUsername());
            newOffer.setSellerUsername(loggedInUser.getUsername());
            loggedInUser.getOffers().add(newOffer);

            log.info("Saving new offer {} to db", newOffer.getDescription());
            offerRepo.save(newOffer);

            Milestone milestone = new Milestone();
            milestone.setMilestoneEnum(MilestoneEnum.ADD_ON_OFFER_MADE);
            milestone.setRemarks("ALT-INV-" + order.getId().toString());
            milestone.setOrderId(order.getId());
            milestone.setOfferId(newOffer.getId());
            milestone.setDate(Calendar.getInstance().getTime());
            milestoneRepo.saveAndFlush(milestone);
            order.getMilestones().add(milestone);
            order2Repo.saveAndFlush(order);
            return newOffer;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

//    @Override
//    public Offer createOfferForSwapRequest(Long reqId, Offer offer) throws InvalidOfferException, SwapRequestNotFoundException, UsernameNotFoundException, NoAccessRightsException, ProjectRequestNotFoundException {
//
//        Offer newOffer = new Offer(offer.getPrice(), offer.getTitle(), offer.getDescription(), offer.getProposedCompletionDate());
//
//        // retrieve logged in user entity by id
//        AppUser user = appUserService.getUser(userService.getCurrentUsername());
//        SwapRequest swapRequest = (SwapRequest) swapRequestRepo.findById(reqId).orElseThrow(
//                () -> new SwapRequestNotFoundException("Swap request id: " + reqId + " does not exist."));
//
//        if (user.getRoles().contains(Role.ADMIN) || swapRequest.getAppUser().getUsername().equals(user.getUsername()) || swapRequest.getAppUser().getUsername() == user.getUsername()) {
//
//            offer.setAppUser(user);
//            offer.setOfferStatus(OfferStatus.PENDING_RESPONSE);
//            offer.setOfferType(OfferType.SWAP_REQUEST);
//            user.getOffers().add(offer);
//
//
//            // offer entity to DB
//            log.info("Saving new offer {} to db", offer.getDescription());
//            offerRepo.save(offer);
//            return offer;
//        } else {
//            throw new NoAccessRightsException("You do not have access to this method!");
//        }
//    }

    @Override
    public Offer createOfferForDelivery(Long deliveryId) throws UsernameNotFoundException, NoAccessRightsException, OrderNotFoundException, OfferNotFoundException, DeliveryNotFoundException {
        Delivery delivery = deliveryService.retrieveDeliveryById(deliveryId);
        if(delivery.getOffer() != null) {
            Offer toDelete = delivery.getOffer();
            offerRepo.delete(toDelete);
        }
        Offer newOffer = new Offer(5.50, "Delivery", "DELIVERY PAYMENT FOR JNT", delivery.getCreationDate());
        //price need to change and fetch, but JNT service fees do not work

        // retrieve logged in user entity by id
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());

        Order2 order = delivery.getOrder();
        if(order == null) {
            throw new OrderNotFoundException("Delivery ID: " + deliveryId + " does not have a valid order.");
        }
        Offer mainOffer = retrieveOfferById(order.getOfferId());

        newOffer.setAppUser(loggedInUser);
        if (mainOffer.getProjectRequest() == null) { //this order is for project listing
            newOffer.setProjectListing(mainOffer.getProjectListing());
        } else { //this offer is for project request
            newOffer.setProjectRequest(mainOffer.getProjectRequest());
        }
        newOffer.setAppUser(loggedInUser);
        newOffer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
        newOffer.setOfferType(OfferType.DELIVERY);
        newOffer.setRefashioneeUsername(mainOffer.getRefashioneeUsername());
        newOffer.setBuyerUsername(mainOffer.getRefashioneeUsername());
        newOffer.setSellerUsername(loggedInUser.getUsername());
        newOffer.setSwapRequesterUsername(loggedInUser.getUsername());
//        loggedInUser.getOffers().add(newOffer); // dont think need to add? Cos is delivery stuff

        log.info("Saving new offer {} to db", newOffer.getDescription());
        offerRepo.save(newOffer);
        delivery.setOffer(newOffer);
        deliveryRepo.saveAndFlush(delivery);
        return newOffer;
    }

    @Override
    public Offer createOfferForSwapItemDelivery(Long deliveryId) throws UsernameNotFoundException, NoAccessRightsException, ItemNotFoundException, DeliveryNotFoundException, OrderNotFoundException {
        Delivery delivery = deliveryService.retrieveDeliveryById(deliveryId);
        Offer newOffer = new Offer(4.00, "Delivery", "DELIVERY PAYMENT FOR JNT", delivery.getCreationDate());
        //standardized

        // retrieve logged in user entity by id
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());

        Order2 order = delivery.getOrder();

        if (order == null) {
            throw new OrderNotFoundException("Delivery ID: " + deliveryId + " does not have a valid order associated with it.");
        }

        newOffer.setAppUser(loggedInUser);
        newOffer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
        newOffer.setOfferType(OfferType.DELIVERY);
        newOffer.setSwapRequesterUsername(loggedInUser.getUsername());

        log.info("Saving new offer {} to db", newOffer.getDescription());
        offerRepo.save(newOffer);
        delivery.setOffer(newOffer);
        deliveryRepo.saveAndFlush(delivery);
        return newOffer;
    }

    @Override
    public Offer createOfferForMPL(Long marketplaceListingId, Integer quantity, String buyer) throws MarketplaceListingNotFoundException, UserNotFoundException {

        MarketplaceListing mpl = marketplaceListingService.retrieveMarketplaceListingById(marketplaceListingId);
        if (quantity > mpl.getQuantity() || quantity < mpl.getMinimum()) {
            throw new MarketplaceListingNotFoundException("Invalid quantity");
        }
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());

        Offer newOffer = new Offer();
        //default for marketplace should be pending payment immediately
        newOffer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
        newOffer.setOfferType(OfferType.MARKETPLACE_LISTING);
        newOffer.setPrice(mpl.getPrice() * quantity);
        newOffer.setQuantity(quantity);
        newOffer.setTransactions(new ArrayList<>());
        newOffer.setTitle(mpl.getTitle());
        newOffer.setDescription("Quantity: " + quantity.toString() + ". Unit Price: " + mpl.getPrice().toString());
        newOffer.setProposedCompletionDate(new Date());

        newOffer.setAppUser(mpl.getAppUser()); //seller is MPL creator, in this case set as appuser refashioner
        newOffer.setRefashioneeUsername(buyer); //set refashionee to be buyer
        newOffer.setSellerUsername(mpl.getAppUser().getUsername());
        newOffer.setBuyerUsername(buyer);
        newOffer.setMarketplaceListing(mpl);

        loggedInUser.getMarketplaceListingOffers().add(newOffer);
        mpl.getOffers().add(newOffer);
        offerRepo.save(newOffer);
        offerRepo.flush();
        return newOffer;
    }

    @Override
    public Offer createOfferForEvent(Long eventId, Integer quantity) throws InvalidOfferException, EventNotFoundException, UsernameNotFoundException, NoAccessRightsException, OfferNotFoundException {

        Event event = eventService.viewEvent(eventId);
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());

        Offer newOffer = new Offer();
        newOffer.setAppUser(loggedInUser);
        newOffer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
        newOffer.setOfferType(OfferType.EVENT);
        newOffer.setPrice(event.getPricePerPax() * quantity);
        newOffer.setQuantity(quantity);
        newOffer.setTransactions(new ArrayList<>());
        newOffer.setTitle(event.getEventName());
        newOffer.setEvent(event);
        newOffer.setDescription("Quantity: " + quantity.toString() + ". Unit Price: " + event.getPricePerPax().toString());
        newOffer.setProposedCompletionDate(new Date());

        newOffer.setEventParticipantUsername(loggedInUser.getUsername());

        loggedInUser.getEventOffers().add(newOffer);
        event.getOffers().add(newOffer);
        offerRepo.save(newOffer);
        offerRepo.flush();
        return newOffer;
    }

    @Override
    public Offer retrieveOfferById(Long id) throws OfferNotFoundException, NoAccessRightsException {
        Optional<Offer> offer = offerRepo.findById(id);

        if (offer.isEmpty()) {
            log.info("Offer does not exist.");
            throw new OfferNotFoundException("Offer not found, id: " + id);
        } else {
            Offer offer1 = offer.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());

            if (offer1.getOfferType().equals(OfferType.DELIVERY)) {
                if (loggedInUser.getUsername().equals(offer1.getSwapRequesterUsername()) || loggedInUser.getUsername().equals(offer1.getSwapRequesterUsername()) || loggedInUser.getRoles().contains(Role.ADMIN)) {
                    return offer1;
                } //for swap item only
            }

            AppUser refashionee = appUserService.getUser(offer1.getRefashioneeUsername());
            AppUser refashioner = offer1.getAppUser();

            if (loggedInUser.getUsername().equals(refashionee.getUsername()) || loggedInUser.getUsername().equals(refashioner.getUsername()) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                return offer1;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public Offer retrieveEventOfferByOfferId(Long id) throws OfferNotFoundException, NoAccessRightsException {
        Optional<Offer> offer = offerRepo.findById(id);

        if (offer.isEmpty()) {
            log.info("Offer does not exist.");
            throw new OfferNotFoundException("Offer not found, id: " + id);
        } else {
            Offer offer1 = offer.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            String participantUsername = offer1.getEventParticipantUsername();

            if (loggedInUser.equals(participantUsername) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                return offer1;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    // refashioner searches for his own offers
    // search by offer status and/or title
    @Override
    public List<Offer> searchOwnOffers(Optional<String[]> statuses, Optional<String> keyword) throws
            OfferNotFoundException {

        Set<Offer> offers = new HashSet<>();

        if (statuses.isEmpty() && keyword.isPresent()) {
            offers.addAll(offerRepo.findByAppUserUsernameAndTitleContainingIgnoreCaseAndOfferStatusIn(userService.getCurrentUsername(), keyword.get(), Arrays.asList(OfferStatus.PENDING_RESPONSE, OfferStatus.PENDING_PAYMENT, OfferStatus.REJECTED)));
        } else if (statuses.isPresent()) {
            List<String> statusStr = Arrays.asList(statuses.get());
            List<OfferStatus> rs = new ArrayList<>();
            for (String s : statusStr) {
                rs.add(OfferStatus.valueOf(s));
            }
            if (keyword.isPresent()) {
                offers.addAll(offerRepo.findByOfferStatusInAndAppUserUsernameAndTitleContainingIgnoreCase(rs, userService.getCurrentUsername(), keyword.get()));
            } else {
                offers.addAll(offerRepo.findByOfferStatusInAndAppUserUsername(rs, userService.getCurrentUsername()));
            }
        }
        if (offers.isEmpty()) {
            throw new OfferNotFoundException("No offers are found under keyword search");
        }

        List<Offer> offers2 = new ArrayList<>();
        offers2.addAll(offers);
        return offers2;
    }

    @Override
    public List<Offer> retrieveOffersByUsername(String username) throws UsernameNotFoundException, OfferNotFoundException, NoAccessRightsException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        AppUser user = appUserService.getUser(username);
        // retrieve offers by username

        if (loggedInUser.equals(user) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            List<Offer> offers = user.getOffers();

            if (offers.isEmpty()) {
                throw new OfferNotFoundException("You have not made any offer.");
            }

            // return offers associated with user
            return offers;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    // only PENDING_RESPONSE, PENDING_PAYMENT, REJECTED offers are retrieved
    @Override
    public List<Offer> retrieveOwnOffers() throws UsernameNotFoundException, OfferNotFoundException, NoAccessRightsException {
        List<Offer> offers = retrieveOffersByUsername(userService.getCurrentUsername());
        List<Offer> offers2 = new ArrayList<>();
        for (Offer o : offers) {
            if (o.getOfferStatus() != OfferStatus.ACCEPTED) {
                offers2.add(o);
            }
        }
        return offers2;
    }

    @Override
    public List<Offer> retrieveAllOffers() throws OfferNotFoundException {
        List<Offer> offers = new ArrayList<Offer>();
        offers = offerRepo.findAll();
        if (offers.isEmpty()) {
            throw new OfferNotFoundException("There are no offers.");
        } else {
            return offers;
        }
    }

    //project listing case, can only be executed by refashioner of the project listing
    @Override
    public List<Offer> retrieveOffersByProjectId(Long projectId) throws ProjectListingNotFoundException, NoAccessRightsException {

        // retrieve project listing entity by id
        ProjectListing project = (ProjectListing) projectListingRepo.findById(projectId).orElseThrow(
                () -> new ProjectListingNotFoundException("Project listing id: " + projectId + " does not exist."));

        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        AppUser projectUser = project.getRefashioner();

        if (loggedInUser.equals(projectUser) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {

            // retrieve offers by projectId
            List<Offer> offers = offerRepo.findByProjectListingId(projectId);

            // return offers associated with project listing
            return offers;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    //can only be executed by refashionee who posted the request or admin
    @Override
    public List<Offer> retrieveOffersByReqId(Long reqId) throws ProjectRequestNotFoundException, NoAccessRightsException {

        // retrieve project request entity by id
        ProjectRequest projectRequest = (ProjectRequest) projectRequestRepo.findById(reqId).orElseThrow(
                () -> new ProjectRequestNotFoundException("Project request id: " + reqId + " does not exist."));

        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        AppUser projectUser = projectRequest.getRefashionee();

        if (loggedInUser.equals(projectUser) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            // retrieve offers by reqId
            List<Offer> offers = offerRepo.findByProjectRequestId(reqId);

            return offers;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    //offer can only be updated by refashioner or admin
    @Override
    public Offer updateOffer(Offer newOffer) throws OfferNotFoundException, NoAccessRightsException {
        Optional<Offer> offer = offerRepo.findById(newOffer.getId());
        if (offer.isEmpty()) {
            throw new OfferNotFoundException("Offer listing with id: " + newOffer.getId() + " not found!");
        } else {
            Offer offerToUpdate = offer.get();

            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashioner = offerToUpdate.getAppUser();

            if (loggedInUser.equals(refashioner) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {

//                offerToUpdate.setOfferStatus(newOffer.getOfferStatus());
                offerToUpdate.setProposedCompletionDate(newOffer.getProposedCompletionDate());
                offerToUpdate.setPrice(newOffer.getPrice());
                offerToUpdate.setDescription(newOffer.getDescription());

                offerRepo.save(offerToUpdate);
                return offerToUpdate;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    //can only be done by refashionee or admin if proj req / listing
    @Override
    public Offer acceptOffer(Long offerId) throws OfferNotFoundException, OfferAlreadyAcceptedException, NoAccessRightsException {
        Optional<Offer> currOffer = offerRepo.findById(offerId);
        if (currOffer.isEmpty()) {
            throw new OfferNotFoundException("Offer listing with id: " + offerId + " not found!");
        } else {
            Offer offerToUpdate = currOffer.get();

            //able to accept offer by all users if it is for marketplace listing
            if (offerToUpdate.getProjectListing() == null && offerToUpdate.getProjectRequest() == null && offerToUpdate.getMarketplaceListing() != null) {
                if (offerToUpdate.getOfferStatus() == OfferStatus.ACCEPTED) {
                    throw new OfferAlreadyAcceptedException("Offer with id: " + offerId + " has already been accepted!");
                }
                offerToUpdate.setOfferStatus(OfferStatus.ACCEPTED); //Accepted
                offerToUpdate.setDateOfAcceptance(new Date());
                offerRepo.save(offerToUpdate);

                return offerToUpdate;
            }

            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            if (offerToUpdate.getSwapRequesterUsername() == null) { //if swap then will have username filled up
                AppUser refashionee = appUserService.getUser(offerToUpdate.getRefashioneeUsername());

                if (loggedInUser.equals(refashionee)) {

                    //You cannot accept an offer that has already been accepted
                    if (offerToUpdate.getOfferStatus() == OfferStatus.ACCEPTED) {
                        throw new OfferAlreadyAcceptedException("Offer with id: " + offerId + " has already been accepted!");
                    }
                    offerToUpdate.setOfferStatus(OfferStatus.ACCEPTED); //Accepted
                    offerRepo.save(offerToUpdate);

                    return offerToUpdate;
                } else {
                    throw new NoAccessRightsException("You do not have access to this method!");
                }
            } else {
                if (loggedInUser.getUsername().equals(offerToUpdate.getSwapRequesterUsername())) {
                    offerToUpdate.setOfferStatus(OfferStatus.ACCEPTED); //Accepted
                    offerRepo.save(offerToUpdate);

                    return offerToUpdate;
                } else {
                    throw new NoAccessRightsException("You do not have access to this method!");
                }
            }
        }
    }

    //not needed if acceptOffer works for addons as well, which it should
    @Override
    public Offer acceptAddOnOffer(Long addOnOfferId) throws NoAccessRightsException, OfferNotFoundException {
        Offer addOnOffer = retrieveOfferById(addOnOfferId);
        addOnOffer.setOfferStatus(OfferStatus.ACCEPTED);
        offerRepo.saveAndFlush(addOnOffer);
        return addOnOffer;
    }

    @Override
    public Offer acceptEventOffer(Long eventOfferId) throws OfferNotFoundException, NoAccessRightsException {
        Offer eventOffer = retrieveEventOfferByOfferId(eventOfferId);
        eventOffer.setOfferStatus(OfferStatus.ACCEPTED);
        offerRepo.saveAndFlush(eventOffer);
        return eventOffer;
    }

    //can only be done by refashionee or admin
    @Override
    public Offer rejectOffer(Long offerId, Optional<String> reasonForDeclining) throws OfferNotFoundException, OfferAlreadyAcceptedException, NoAccessRightsException {
        Optional<Offer> currOffer = offerRepo.findById(offerId);
        if (currOffer.isEmpty()) {
            throw new OfferNotFoundException("Offer listing with id: " + offerId + " not found!");
        } else {
            Offer offerToUpdate = currOffer.get();
            //Cannot reject if already accepted

            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(offerToUpdate.getRefashioneeUsername());

            if (loggedInUser.equals(refashionee)) {

                if (offerToUpdate.getOfferStatus() == OfferStatus.ACCEPTED) {
                    throw new OfferAlreadyAcceptedException("Offer with id: " + offerId + " has already been accepted!");
                }

                offerToUpdate.setOfferStatus(OfferStatus.REJECTED);

                if (reasonForDeclining.isPresent()) {
                    offerToUpdate.setReasonForDecliningOffer(reasonForDeclining.get());
                }
                Project topic = offerToUpdate.getProjectRequest();
                if (topic == null) {
                    topic = (Project) offerToUpdate.getProjectListing();
                }

                Long topicId;
                if(topic == null) {
                    topicId = offerToUpdate.getMarketplaceListing().getId();
                } else {
                    topicId = topic.getId();
                }

                String chatId = chat2Service.generateChatAlternativeId(loggedInUser.getId(), offerToUpdate.getAppUser().getId(), Optional.ofNullable(topicId));

                if(reasonForDeclining.isPresent()) {
                    ChatMessage2 newMessage = new ChatMessage2("I have rejected your offer entitled: " + offerToUpdate.getTitle() + " Reason: " + reasonForDeclining.get(), loggedInUser.getUsername(), offerToUpdate.getAppUser().getUsername(), Optional.empty(), false, chatId, false);
                    chat2Service.sendMessage(offerToUpdate.getAppUser().getUsername(), newMessage, Optional.of(topicId), null);
                } else {
                    ChatMessage2 newMessage = new ChatMessage2("I have rejected your offer entitled: " + offerToUpdate.getTitle() + ".", loggedInUser.getUsername(), offerToUpdate.getAppUser().getUsername(), Optional.empty(), false, chatId, true);
                    chat2Service.sendMessage(offerToUpdate.getAppUser().getUsername(), newMessage, Optional.of(topicId), null);
                }

                offerRepo.save(offerToUpdate);

                return offerToUpdate;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    //used only if you want to create milestone when an add on offer is rejected
    @Override
    public Offer rejectAddOnOffer(Long offerId, Optional<String> reasonForDeclining, Long orderId) throws OfferAlreadyAcceptedException, NoAccessRightsException, OfferNotFoundException, OrderNotFoundException {
        Offer offer = this.rejectOffer(offerId, reasonForDeclining);
        Order2 order = order2Service.retrieveOrderById(orderId);

        Milestone milestone = new Milestone();
        milestone.setMilestoneEnum(MilestoneEnum.ADD_ON_OFFER_DECLINED);
        if(reasonForDeclining.isPresent()) {
            milestone.setRemarks(reasonForDeclining.get());
        }
        milestone.setOrderId(order.getId());
        milestone.setOfferId(offer.getId());
        milestone.setDate(Calendar.getInstance().getTime());
        milestoneRepo.saveAndFlush(milestone);
        order.getMilestones().add(milestone);
        order2Repo.saveAndFlush(order);

        return offer;
    }

    @Override
    public Offer createNewTransactionForOffer(Long offerId) throws OfferNotFoundException, OrderAlreadyExistsException {
        //Logic: Check to see if there exists an order where the offerId = current offer id
        //Orders are only created when the transaction has completed, hence should not exist

        Order2 order = order2Repo.findByOfferId(offerId);
        if (order == null) {
            Optional<Offer> offer = offerRepo.findById(offerId);
            if (offer.isEmpty()) {
                throw new OfferNotFoundException("Offer listing with id: " + offerId + " not found!");
            } else {
                Offer offerToUpdate = offer.get();
                offerToUpdate.setOfferStatus(OfferStatus.ACCEPTED); //Accepted

                //Creating a Transaction
                Transaction transaction = new Transaction();
                transaction.setOfferId(offerToUpdate.getId());
                transaction.setAmount(offerToUpdate.getPrice());
                Date currentDate = new Date();
                transaction.setDateCreated(currentDate);
                transaction.setPaymentStatus(PaymentStatus.PENDING); //Pending payment
                log.info("Saving new transaction {} to db", transaction.getId());
                transactionRepo.save(transaction);

                List<Transaction> transactionList = offerToUpdate.getTransactions();
                transactionList.add(transaction);
                offerToUpdate.setTransactions(transactionList);
//
//            offerToUpdate.setProjectRequest(offer.getProjectRequest());
//            offerToUpdate.setProjectListing(offer.getProjectListing());

                offerRepo.save(offerToUpdate);

                return offerToUpdate;
            }
        } else {
            throw new OrderAlreadyExistsException("An order for this offer has already been created, no payment can be made.");
        }
    }

    //can only be done by refashioner
    @Override
    public void deleteOfferForProjectListing(Long id) throws OfferNotFoundException, NoAccessRightsException {

        Optional<Offer> offer = offerRepo.findById(id);
        if (offer.isEmpty()) {
            throw new OfferNotFoundException("Offer with id: " + id + " not found!");
        } else {
            Offer offerToDelete = offer.get();

            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashioner = offerToDelete.getAppUser();

            if (loggedInUser.equals(refashioner) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {

                offerRepo.findByAppUserUsername(userService.getCurrentUsername()).remove(offerToDelete);
                offerRepo.findByProjectListingId(offerToDelete.getProjectListing().getId()).remove(offerToDelete);

                offerRepo.delete(offerToDelete);
                offerRepo.flush();
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    //can only be done by refashioner
    @Override
    public void deleteOfferForProjectReq(Long id) throws OfferNotFoundException, NoAccessRightsException {

        Optional<Offer> offer = offerRepo.findById(id);
        if (offer.isEmpty()) {
            throw new OfferNotFoundException("Offer with id: " + id + " not found!");
        } else {
            Offer offerToDelete = offer.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashioner = offerToDelete.getAppUser();

            if (loggedInUser.equals(refashioner) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {

                offerRepo.findByAppUserUsername(userService.getCurrentUsername()).remove(offerToDelete);
                offerRepo.findByProjectRequestId(offerToDelete.getProjectRequest().getId()).remove(offerToDelete);

                offerRepo.delete(offerToDelete);
                offerRepo.flush();
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public Project retrieveProjectUnderOffer(Long offerId) throws NoAccessRightsException, OfferNotFoundException {
        Offer offer = retrieveOfferById(offerId);
        ProjectRequest pr = offer.getProjectRequest();
        ProjectListing pl = offer.getProjectListing();
        if (pr == null) {
            return pl;
        }
        return pr;
    }

    //    @Override
//    public Offer createOffer(Long pId, Offer offer) throws InvalidOfferException, ProjectListingNotFoundException, UsernameNotFoundException {
//
//        Offer newOffer = new Offer(offer.getStatus(),
//                offer.getProposedCompletionDate(), offer.getPrice(), offer.getDescription());
//
//        // retrieve logged in user entity by id
//        AppUser user = appUserService.getUser(appUserService.getCurrUsername());
//        offer.setAppUser(user);
//        // retrieve project entity by id
//        Optional<Project> exists = projectRepo.findById(pId);
//        if (exists.isEmpty()) {
//            throw new ProjectListingNotFoundException("Project Listing id: " + pId + " does not exist.");
//        } else {
//            Project project = exists.get();
//            if (project instanceof ProjectListing) {
//                ProjectListing projectListing = (ProjectListing) project;
//
//                // set project listing to offer entity
//                offer.setAppUser(user);
//                offer.setProjectListing(projectListing);
//                user.getOffers().add(offer);
//                projectListing.getOffers().add(offer);
//            } else {
//                ProjectRequest projectRequest = (ProjectRequest) project;
//
//                // set project req to offer entity
//                offer.setAppUser(user);
//                offer.setProjectRequest(projectRequest);
//                user.getOffers().add(offer);
//                projectRequest.setOffer(offer);
//            }
//
//            // offer entity to DB
//            log.info("Saving new offer {} to db", offer.getDescription());
//            offerRepo.save(offer);
//            return offer;
//        }
//    }

    //    @Override
//    public Offer createOfferForAddOnProjectListing(Long projectId, Offer offer) throws InvalidOfferException, UsernameNotFoundException, NoAccessRightsException, ProjectListingNotFoundException {
//
//        Offer newOffer = new Offer(offer.getPrice(), offer.getTitle(), offer.getDescription(), offer.getProposedCompletionDate());
//
//        // retrieve logged in user entity by id
//        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
//
//        if (loggedInUser.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
//            // retrieve project request entity by id
//            ProjectListing projectListing = (ProjectListing) projectListingRepo.findById(projectId).orElseThrow(
//                    () -> new ProjectListingNotFoundException("Project Listing id: " + projectId + " does not exist."));
//
//            newOffer.setAppUser(loggedInUser);
//            newOffer.setProjectListing(projectListing);
//            newOffer.setPrice(offer.getPrice());
//            newOffer.setOfferStatus(OfferStatus.PENDING_RESPONSE);
//            newOffer.setRefashioneeUsername(offer.getRefashioneeUsername());
//            loggedInUser.getOffers().add(newOffer);
//
//            log.info("Saving new offer {} to db", newOffer.getDescription());
//            offerRepo.save(newOffer);
//            return offer;
//        } else {
//            throw new NoAccessRightsException("You do not have access to this method!");
//        }
//    }
//
//    @Override
//    public Offer createOfferForAddOnProjectRequest(Long reqId, Offer offer) throws InvalidOfferException, UsernameNotFoundException, NoAccessRightsException, ProjectRequestNotFoundException {
//
//        Offer newOffer = new Offer(offer.getPrice(), offer.getTitle(), offer.getDescription(), offer.getProposedCompletionDate());
//
//        // retrieve logged in user entity by id
//        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
//
//        if (loggedInUser.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
//            // retrieve project request entity by id
//            ProjectRequest projectRequest = (ProjectRequest) projectRequestRepo.findById(reqId).orElseThrow(
//                    () -> new ProjectRequestNotFoundException("Project Listing id: " + reqId + " does not exist."));
//
//            newOffer.setAppUser(loggedInUser);
//            newOffer.setProjectRequest(projectRequest);
//            newOffer.setPrice(offer.getPrice());
//            newOffer.setOfferStatus(OfferStatus.PENDING_RESPONSE);
//            newOffer.setRefashioneeUsername(offer.getRefashioneeUsername());
//            newOffer.setBuyerUsername(offer.getRefashioneeUsername());
//            newOffer.setSellerUsername(loggedInUser.getUsername());
//            loggedInUser.getOffers().add(newOffer);
//
//            log.info("Saving new offer {} to db", newOffer.getDescription());
//            offerRepo.save(newOffer);
//            return newOffer;
//        } else {
//            throw new NoAccessRightsException("You do not have access to this method!");
//        }
//    }
}
