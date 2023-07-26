package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.*;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Exceptions.OrderNotFoundException;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Model.Order2;
import com.altnative.Alt.Native.Repository.*;
import com.altnative.Alt.Native.Repository.Order2Repo;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class Order2ServiceImpl implements Order2Service {

    private final TransactionRepo transactionRepo;
    private final Order2Repo order2Repo;
    private final OfferRepo offerRepo;
    private final AddOnRepo addOnRepo;
    private final MarketplaceListingRepo marketplaceListingRepo;
    private final UserService userService;
    private final AppUserService appUserService;
    private final MilestoneRepo milestoneRepo;
    private final MilestoneService milestoneService;
    private final WalletService walletService;

    @Value("${baseURL}")
    private String baseURL;

    @Value("${STRIPE_SECRET_KEY}")
    private String apiKey;

//    @Override
//    public Order2 createOrderForOffer(Long offerId, Order2 order) throws InvalidOrderException, OfferNotFoundException, InvalidOfferException {
//
//        Offer offer = offerRepo.findById(offerId).orElseThrow(() ->
//                new InvalidOfferException("Offer id: " + offerId + " does not exist."));
//        log.info("Offer id: " + offer.getId());
//
//        Order2 newOrder = new Order2(order.getPrice(), offer);
//        log.info("Order status: " + newOrder.getOrderStatus());
//        log.info("Order id: " + newOrder.getId());
//
//        newOrder.setOffer(offer);
//        // order entity to DB
//        log.info("Saving new order {} to db");
//        order2Repo.save(newOrder);
//        return newOrder;
//
//    }

    @Override
    public Order2 updateOrder(Order2 newOrder) throws OrderNotFoundException, NoAccessRightsException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        AppUser refashionee = appUserService.getUser(newOrder.getAppUserUsername());
        AppUser refashioner = appUserService.getUser(newOrder.getRefashionerUsername());
        if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner)) {
            Optional<Order2> currOrder = order2Repo.findById(newOrder.getId());
            if (currOrder.isEmpty()) {
                throw new OrderNotFoundException("Order listing with id: " + newOrder.getId() + " not found!");
            } else {
                Order2 orderToUpdate = currOrder.get();
                orderToUpdate.setOrderStatus(newOrder.getOrderStatus());
                orderToUpdate.setMilestones(newOrder.getMilestones());
                orderToUpdate.setOrderPrice(newOrder.getOrderPrice());
                orderToUpdate.setOfferId(newOrder.getOfferId());
                orderToUpdate.setTransactionId(newOrder.getTransactionId());

                order2Repo.save(orderToUpdate);

                return orderToUpdate;
            }
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public List<Order2> searchOwnMplOrders(Optional<String[]> statuses, Optional<String> keyword) throws
            OrderNotFoundException {

        List<Order2> orders = searchOwnBuyerOrders(statuses, keyword);
        orders.addAll(searchOwnSellerOrders(statuses, keyword));

        if (orders.isEmpty()) {
            throw new OrderNotFoundException("No orders are found under keyword search");
        }
        return orders;
    }

    // buyer searches for his own *marketplace* orders
    // search by status, and/or offer title
    @Override
    public List<Order2> searchOwnBuyerOrders(Optional<String[]> statuses, Optional<String> keyword) {

        Set<Order2> orders = new HashSet<>();

        if (statuses.isEmpty() && keyword.isPresent()) {
            orders.addAll(order2Repo.findByBuyerUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(userService.getCurrentUsername(), Arrays.asList(OfferType.MARKETPLACE_LISTING), keyword.get()));
        } else if (statuses.isPresent()) {
            List<String> statusStr = Arrays.asList(statuses.get());
            List<OrderStatus> rs = new ArrayList<>();
            for (String s : statusStr) {
                rs.add(OrderStatus.valueOf(s));
            }
            if (keyword.isPresent()) {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndBuyerUsernameAndOfferTitleContainingIgnoreCase(rs, Arrays.asList(OfferType.MARKETPLACE_LISTING), userService.getCurrentUsername(), keyword.get()));
            } else {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndBuyerUsername(rs, Arrays.asList(OfferType.MARKETPLACE_LISTING), userService.getCurrentUsername()));
            }
        }

        List<Order2> orders2 = new ArrayList<>();
        orders2.addAll(orders);
        return orders2;
    }

    // seller searches for his own *marketplace* orders
    // search by status, and/or offer title
    @Override
    public List<Order2> searchOwnSellerOrders(Optional<String[]> statuses, Optional<String> keyword) {

        Set<Order2> orders = new HashSet<>();

        if (statuses.isEmpty() && keyword.isPresent()) {
            orders.addAll(order2Repo.findBySellerUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(userService.getCurrentUsername(), Arrays.asList(OfferType.MARKETPLACE_LISTING), keyword.get()));
        } else if (statuses.isPresent()) {
            List<String> statusStr = Arrays.asList(statuses.get());
            List<OrderStatus> rs = new ArrayList<>();
            for (String s : statusStr) {
                rs.add(OrderStatus.valueOf(s));
            }
            if (keyword.isPresent()) {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndSellerUsernameAndOfferTitleContainingIgnoreCase(rs, Arrays.asList(OfferType.MARKETPLACE_LISTING), userService.getCurrentUsername(), keyword.get()));
            } else {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndSellerUsername(rs, Arrays.asList(OfferType.MARKETPLACE_LISTING), userService.getCurrentUsername()));
            }
        }

        List<Order2> orders2 = new ArrayList<>();
        orders2.addAll(orders);
        return orders2;
    }

    // refashioner searches for his own *project* orders
    // search by status, and/or offer title
    @Override
    public List<Order2> searchOwnRefashionerOrders(Optional<String> status, Optional<String> keyword) throws
            OrderNotFoundException {

        Set<Order2> orders = new HashSet<>();
        if (status.isEmpty() && keyword.isPresent()) {
            orders.addAll(order2Repo.findByRefashionerUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(userService.getCurrentUsername(), Arrays.asList(OfferType.PROJECT_LISTING, OfferType.PROJECT_REQUEST), keyword.get()));
        } else if (status.isPresent()) {
            List<OrderStatus> rs = new ArrayList<>();
            rs.add(OrderStatus.valueOf(status.get()));
            if (keyword.isPresent()) {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndRefashionerUsernameAndOfferTitleContainingIgnoreCase(rs, Arrays.asList(OfferType.PROJECT_LISTING, OfferType.PROJECT_REQUEST), userService.getCurrentUsername(), keyword.get()));
            } else {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndRefashionerUsername(rs, Arrays.asList(OfferType.PROJECT_LISTING, OfferType.PROJECT_REQUEST), userService.getCurrentUsername()));
            }
        }
        if (orders.isEmpty()) {
            throw new OrderNotFoundException("No orders are found under keyword search");
        }
        List<Order2> orders2 = new ArrayList<>();
        orders2.addAll(orders);
        return orders2;
    }

    // refashionee searches for his own *project* orders
    // search by status, and/or offer title
    @Override
    public List<Order2> searchOwnRefashioneeOrders(Optional<String> status, Optional<String> keyword) throws
            OrderNotFoundException {

        Set<Order2> orders = new HashSet<>();
        if (status.isEmpty() && keyword.isPresent()) {
            orders.addAll(order2Repo.findByAppUserUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(userService.getCurrentUsername(), Arrays.asList(OfferType.PROJECT_LISTING, OfferType.PROJECT_REQUEST), keyword.get()));
        } else if (status.isPresent()) {
            List<OrderStatus> rs = new ArrayList<>();
            rs.add(OrderStatus.valueOf(status.get()));
            if (keyword.isPresent()) {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndAppUserUsernameAndOfferTitleContainingIgnoreCase(rs, Arrays.asList(OfferType.PROJECT_LISTING, OfferType.PROJECT_REQUEST), userService.getCurrentUsername(), keyword.get()));
            } else {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndAppUserUsername(rs, Arrays.asList(OfferType.PROJECT_LISTING, OfferType.PROJECT_REQUEST), userService.getCurrentUsername()));
            }
        }
        if (orders.isEmpty()) {
            throw new OrderNotFoundException("No orders are found under keyword search");
        }
        List<Order2> orders2 = new ArrayList<>();
        orders2.addAll(orders);
        return orders2;
    }

    @Override
    public Order2 retrieveEventOrderById(Long id) throws OrderNotFoundException, NoAccessRightsException, UsernameNotFoundException {
        Optional<Order2> order = order2Repo.findById(id);

        if (order.isEmpty()) {
            log.info("Order does not exist.");
            throw new OrderNotFoundException("Order not found, id: " + id);
        } else {
            Order2 order2 = order.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser participant = appUserService.getUser(order2.getEventParticipantUsername());

            if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(participant)) {
                return order2;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public List<Order2> searchOwnEventOrders(Optional<String[]> statuses, Optional<String> keyword) throws
            OrderNotFoundException {

        Set<Order2> orders = new HashSet<>();

        if (statuses.isEmpty() && keyword.isPresent()) {
            orders.addAll(order2Repo.findByAppUserUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(userService.getCurrentUsername(), Arrays.asList(OfferType.EVENT, OfferType.EVENT), keyword.get()));
        } else if (statuses.isPresent()) {
            List<String> statusStr = Arrays.asList(statuses.get());
            List<OrderStatus> rs = new ArrayList<>();
            for (String s : statusStr) {
                rs.add(OrderStatus.valueOf(s));
            }
            if (keyword.isPresent()) {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndAppUserUsernameAndOfferTitleContainingIgnoreCase(rs, Arrays.asList(OfferType.EVENT, OfferType.EVENT), userService.getCurrentUsername(), keyword.get()));
            } else {
                orders.addAll(order2Repo.findByOrderStatusInAndOfferTypeInAndAppUserUsername(rs, Arrays.asList(OfferType.EVENT, OfferType.EVENT), userService.getCurrentUsername()));
            }
        }
        if (orders.isEmpty()) {
            throw new OrderNotFoundException("No orders are found under keyword search");
        }
        List<Order2> orders2 = new ArrayList<>();
        orders2.addAll(orders);
        return orders2;
    }

    @Override
    public Order2 retrieveOrderById(Long id) throws OrderNotFoundException, NoAccessRightsException, UsernameNotFoundException {
        Optional<Order2> order = order2Repo.findById(id);

        if (order.isEmpty()) {
            log.info("Order does not exist.");
            throw new OrderNotFoundException("Order not found, id: " + id);
        } else {
            Order2 order2 = order.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            if (order2.getOfferType().equals(OfferType.SWAP_LISTING)) {
                AppUser swapRequester = appUserService.getUser(order2.getSwapRequesterUsername());
                if (loggedInUser.getRoles().contains(Role.ADMIN) || loggedInUser.getUsername().equals(swapRequester.getUsername()) || loggedInUser.getUsername() == swapRequester.getUsername()) {
                    return order2;
                }
            }

            AppUser refashionee = appUserService.getUser(order2.getAppUserUsername());
            AppUser refashioner = appUserService.getUser(order2.getRefashionerUsername());

            if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner)) {
                return order2;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public String retrieveInvoiceNumber(Long orderId) throws OrderNotFoundException, NoAccessRightsException {
        Optional<Order2> order = order2Repo.findById(orderId);

        if (order.isEmpty()) {
            log.info("Order does not exist.");
            throw new OrderNotFoundException("Order not found, id: " + orderId);
        } else {
            Order2 order2 = order.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(order2.getAppUserUsername());
            AppUser refashioner = appUserService.getUser(order2.getRefashionerUsername());

            if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner)) {
                Long offerId = order.get().getOfferId();
                String invoiceNumber = "ALT-INV-" + offerId.toString();

                return invoiceNumber;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public List<Order2> retrieveAllOrders() throws OrderNotFoundException {

        List<Order2> orders = order2Repo.findAll();

        if (orders.isEmpty()) {
            throw new OrderNotFoundException("No orders found");
        }

        return orders;
    }

//    @Override
//    public List<Order2> retrieveOrdersByUsername(String username) throws OrderNotFoundException {
//
//        List<Order2> orders = order2Repo.findByAppUserUsername(username);
//
//        if (orders.isEmpty()) {
//            throw new OrderNotFoundException("No orders found under this username");
//        }
//
//        return orders;
//    }

    @Override
    public List<Order2> retrieveOwnRefashionerOrders() {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        return order2Repo.findByRefashionerUsernameAndOfferTypeIn(userService.getCurrentUsername(), Arrays.asList(OfferType.PROJECT_LISTING, OfferType.PROJECT_REQUEST));
    }

    @Override
    public List<Order2> retrieveAllCompletedOrdersForPRandPL() {
        List<Order2> orders = retrieveOwnRefashionerOrders(); //all project requests and listings
        //filter out the completed ones
        List<Order2> completedOrders = new ArrayList<>();
        for (Order2 order: orders) {
            if (order.getOrderStatus().equals(OrderStatus.COMPLETED)) {
                if (order.getDisputes().isEmpty()) { //no disputes, completed for sure
                    completedOrders.add(order);
                } else { //have disputes
                    boolean disputeAcceptedAndCompleted = false;
                    List<Dispute> orderDisputes = new ArrayList<>();
                    for (Dispute dispute: orderDisputes) {
                        if (dispute.getDisputeStatus().equals(DisputeStatus.DISPUTE_REQUEST_ACCEPT_COMPLETED)) {
                            //don't add this order
                            disputeAcceptedAndCompleted = true;
                            break;
                        }
                    }
                    if (disputeAcceptedAndCompleted == false) { //means no dispute that was finalised
                        completedOrders.add(order);
                    } else {
                        disputeAcceptedAndCompleted = false; //reset back
                    }
                }
            }
        }
        return completedOrders;
    }

    @Override
    public List<Order2> retrieveOwnRefashioneeOrders() {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        return order2Repo.findByAppUserUsernameAndOfferTypeIn(userService.getCurrentUsername(), Arrays.asList(OfferType.PROJECT_LISTING, OfferType.PROJECT_REQUEST));
    }

    @Override
    public List<Order2> retrieveOwnMplOrders() {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        List<Order2> orders = order2Repo.findBySellerUsernameAndOfferTypeIn(userService.getCurrentUsername(), Arrays.asList(OfferType.MARKETPLACE_LISTING));
        orders.addAll(order2Repo.findByBuyerUsernameAndOfferTypeIn(userService.getCurrentUsername(), Arrays.asList(OfferType.MARKETPLACE_LISTING)));
        return orders;
    }

    @Override
    public List<AddOn> retrieveAddOnsByOrderId(Long orderId) throws OrderNotFoundException, NoAccessRightsException {
        Optional<Order2> order = order2Repo.findById(orderId);

        if (order.isEmpty()) {
            log.info("Order does not exist.");
            throw new OrderNotFoundException("Order not found, id: " + orderId);
        } else {
            Order2 order2 = order.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(order2.getAppUserUsername());
            AppUser refashioner = appUserService.getUser(order2.getRefashionerUsername());

            if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner)) {
                List<AddOn> addOns = order.get().getAddOns();
                return addOns;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    //    @Override
//    public Order2 createOrderForMarketplaceListing(Long marketplaceListingId, Order2 order) throws InvalidOrderException, MarketplaceListingNotFoundException {
//
//        MarketplaceListing marketplaceListing = (MarketplaceListing) marketplaceListingRepo.findById(marketplaceListingId).orElseThrow(
//                () -> new MarketplaceListingNotFoundException("Marketplace Listing with id: " + marketplaceListingId + " does not exist."));
//
//        if (!order.getMarketplaceListings().contains(marketplaceListing)) {
//            order.getMarketplaceListings().add(marketplaceListing);
//            marketplaceListing.getOrders().add(order);
//        }
//
//        log.info("Saving new offer {} to db", order.getId());
//        order2Repo.save(order);
//        return order;
//
//    }

//    @Override
//    public void deleteMarketplaceOrder(Long marketId, Long orderId) throws MarketplaceListingNotFoundException, OrderNotFoundException {
//        Optional<Order2> order = order2Repo.findById(orderId);
//        if (order.isEmpty()) {
//            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
//        } else {
//            Order2 orderToDelete = order.get();
//
//            MarketplaceListing marketplaceListing = marketplaceListingRepo.findById(marketId).orElseThrow(
//                    () -> new MarketplaceListingNotFoundException("Marketplace Listing id: " + marketId + " does not exist."));
//
//            marketplaceListing.getOrders().remove(orderToDelete);
//
//            List<MarketplaceListing> marketplaceListings = marketplaceListingRepo.findMarketplaceListingsWithOrder(orderToDelete);
//
//            if (marketplaceListings.size() == 0) {
//                order2Repo.delete(orderToDelete);
//                order2Repo.flush();
//            }
//        }
//
//    }

    //    @Override
//    public List<Order2> retrieveOrdersFromMarketplaceListing(Long marketplaceListingId) throws MarketplaceListingNotFoundException {
//
//        MarketplaceListing marketplaceListing = (MarketplaceListing) marketplaceListingRepo.findById(marketplaceListingId).orElseThrow(
//                () -> new MarketplaceListingNotFoundException("Marketplace Listing with id: " + marketplaceListingId + " does not exist."));
//
//        List<Order2> orders = marketplaceListing.getOrders();
//        return orders;
//    }

    @Override
    public void deleteOrderAddOns(Long orderId, Long addOnId) throws OrderNotFoundException, AddOnNotFoundException, NoAccessRightsException {
        Optional<Order2> order = order2Repo.findById(orderId);

        if (order.isEmpty()) {
            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
        } else {
            Order2 order2 = order.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(order2.getAppUserUsername());
            AppUser refashioner = appUserService.getUser(order2.getRefashionerUsername());

            if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner)) {
                List<AddOn> addOns = order.get().getAddOns();
                AddOn addOnToDelete = addOnRepo.findById(addOnId).orElseThrow(
                        () -> new AddOnNotFoundException("Add on id: " + addOnId + " does not exist."));
                addOns.remove(addOnToDelete);

                addOnRepo.delete(addOnToDelete);
                addOnRepo.flush();
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public Date retrieveProposedCompletionDate(Long orderId) throws OrderNotFoundException, NoAccessRightsException {
        Optional<Order2> order = order2Repo.findById(orderId);

        if (order.isEmpty()) {
            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
        } else {
            Order2 order2 = order.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(order2.getAppUserUsername());
            AppUser refashioner = appUserService.getUser(order2.getRefashionerUsername());

            if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner)) {
                Long offerId = order.get().getOfferId();
                Offer offer = offerRepo.getById(offerId);
                return offer.getProposedCompletionDate();
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public int retrieveDaysLeftUntilCompletion(Long orderId) throws OrderNotFoundException, NoAccessRightsException {
        Date completionDate = this.retrieveProposedCompletionDate(orderId);
        LocalDate completionDate2 = completionDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        Period period = Period.between(LocalDate.now(), completionDate2);
        int diff = period.getDays();

        Optional<Order2> order = order2Repo.findById(orderId);
        Order2 order2 = order.get();
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        AppUser refashionee = appUserService.getUser(order2.getAppUserUsername());
        AppUser refashioner = appUserService.getUser(order2.getRefashionerUsername());
        if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner)) {
            return diff;
        }
        throw new NoAccessRightsException("You do not have access to this method!");
    }

    @Override
    public Order2 completeOrder(Long orderId) throws OrderNotFoundException, NoAccessRightsException {

        Optional<Order2> order = order2Repo.findById(orderId);

        if (order.isEmpty()) {
            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
        } else {
            Order2 order2 = order.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(order2.getAppUserUsername());
            AppUser refashioner = appUserService.getUser(order2.getRefashionerUsername());

            //Refashionee should be able to mark the order as complete upon receipt of items
            if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee)) {
                order2.setOrderStatus(OrderStatus.COMPLETED);
                List<Milestone> orderMilestones = order2.getMilestones();
                Milestone finalMilestone = new Milestone();
                finalMilestone.setOfferId(order2.getOfferId());
                finalMilestone.setOrderId(orderId);
                finalMilestone.setMilestoneEnum(MilestoneEnum.ORDER_COMPLETE);
                finalMilestone.setDate(Calendar.getInstance().getTime());
                milestoneRepo.save(finalMilestone);

                orderMilestones.add(finalMilestone);
                order2.setMilestones(orderMilestones);
                order2Repo.save(order2);
                return order2;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    //essentially creating a milestone to show progress update request
    @Override
    public void requestProgressUpdate(Long orderId, Optional<String> remarks) throws UserDoesNotExistException, UsernameNotFoundException, OrderNotFoundException, NoAccessRightsException {
        Optional<Order2> order2Optional = order2Repo.findById(orderId);
        if (order2Optional.isEmpty()) {
            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
        } else {
            Order2 order = order2Optional.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(order.getAppUserUsername());

            if (loggedInUser.equals(refashionee)) { //only refashionee can request progress update
                Milestone progressUpdateRequest = new Milestone();
                progressUpdateRequest.setOfferId(order.getOfferId());
                progressUpdateRequest.setOrderId(order.getId());
                progressUpdateRequest.setDate(Calendar.getInstance().getTime());
                progressUpdateRequest.setMilestoneEnum(MilestoneEnum.PROGRESS_UPDATE_REQUEST);
                if (remarks.isPresent()) {
                    progressUpdateRequest.setRemarks(remarks.get());
                }
                milestoneRepo.save(progressUpdateRequest);

                order.getMilestones().add(progressUpdateRequest);
                order2Repo.save(order);
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public void approveFinalProduct(Long orderId, Optional<String> remarks) throws OrderNotFoundException, NoAccessRightsException, UserDoesNotExistException, UsernameNotFoundException {
        Optional<Order2> order2Optional = order2Repo.findById(orderId);
        if (order2Optional.isEmpty()) {
            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
        } else {
            Order2 order = order2Optional.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(order.getAppUserUsername());

            if (!order.getOrderStatus().equals(OrderStatus.ACCEPTED)) {
                throw new NoAccessRightsException("Order has already been approved by the refashionee/buyer");
            }
            if (loggedInUser.equals(refashionee)) { //only refashionee can approve final product
                Milestone approvedFinalProductMilestone = new Milestone();
                approvedFinalProductMilestone.setOfferId(order.getOfferId());
                approvedFinalProductMilestone.setOrderId(order.getId());
                approvedFinalProductMilestone.setDate(Calendar.getInstance().getTime());
                approvedFinalProductMilestone.setMilestoneEnum(MilestoneEnum.FINAL_APPROVAL_OK);
                if (remarks.isPresent()) {
                    approvedFinalProductMilestone.setRemarks(remarks.get());
                }
                order.setOrderStatus(OrderStatus.PRODUCT_COMPLETED);
                milestoneRepo.save(approvedFinalProductMilestone);
                walletService.award(order.getId());

                order.getMilestones().add(approvedFinalProductMilestone);
                order2Repo.save(order);
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public void rejectFinalProduct(Long orderId, Optional<String> remarks) throws OrderNotFoundException, NoAccessRightsException, UserDoesNotExistException, UsernameNotFoundException, RejectFinalProductErrorException {
        Optional<Order2> order2Optional = order2Repo.findById(orderId);
        if (order2Optional.isEmpty()) {
            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
        } else {
            Order2 order = order2Optional.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashionee = appUserService.getUser(order.getAppUserUsername());

            if (loggedInUser.equals(refashionee)) { //only refashionee can reject final product
                for (Milestone m : order.getMilestones()) {
                    if (m.getMilestoneEnum() == MilestoneEnum.FINAL_APPROVAL_OK) {
                        throw new RejectFinalProductErrorException("You are not able to reject this final product as you have previously approved it.");
                    }
                }

                Milestone rejectFinalProductMilestone = new Milestone();
                rejectFinalProductMilestone.setOfferId(order.getOfferId());
                rejectFinalProductMilestone.setOrderId(order.getId());
                rejectFinalProductMilestone.setDate(Calendar.getInstance().getTime());
                rejectFinalProductMilestone.setMilestoneEnum(MilestoneEnum.FINAL_APPROVAL_REJECTED);
                if (remarks.isPresent()) {
                    rejectFinalProductMilestone.setRemarks(remarks.get());
                }
                milestoneRepo.save(rejectFinalProductMilestone);

                order.getMilestones().add(rejectFinalProductMilestone);
                order2Repo.save(order);
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public Milestone addProgressUpdatePhotos(List<MultipartFile> files, Long orderId, Optional<String> remarks) throws UserDoesNotExistException, UsernameNotFoundException, OrderNotFoundException, NoAccessRightsException, InvalidFileException, S3Exception {
        Milestone m = new Milestone();
        m.setMilestoneEnum(MilestoneEnum.PROGRESS_UPDATE);
        if (remarks.isPresent()) {
            m.setRemarks(remarks.get());
        }
        return milestoneService.createMilestone(files, m, orderId);
    }

    @Override
    public Milestone addFinalApprovalUpdatePhotos(List<MultipartFile> files, Long orderId, Optional<String> remarks) throws OrderNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException {
        Milestone m = new Milestone();
        m.setMilestoneEnum(MilestoneEnum.FINAL_APPROVAL_PENDING);
        if (remarks.isPresent()) {
            m.setRemarks(remarks.get());
        }
        return milestoneService.createMilestone(files, m, orderId);
    }
}
