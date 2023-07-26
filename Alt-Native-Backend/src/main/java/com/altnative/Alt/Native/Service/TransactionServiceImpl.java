package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.*;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepo transactionRepo;
    private final OfferRepo offerRepo;
    private final Order2Repo order2Repo;
    private final MilestoneRepo milestoneRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final Chat2Service chat2Service;
    private final Chat2Repository chat2Repository;
    private final OfferService offerService;
    private final Order2Service order2Service;
    private final DeliveryService deliveryService;
    private final AddOnRepo addOnRepo;
    private final AddOnService addOnService;
    private final MarketplaceListingRepo marketplaceListingRepo;

    @Override
    public Transaction createTransaction(Long offerId, Transaction transaction) throws CreditCardNotFoundException, OfferNotFoundException {

        // retrieve offer entity by id
        Offer offer = offerRepo.findById(offerId).orElseThrow(
                () -> new OfferNotFoundException("Offer id: " + offerId + " does not exist."));

        transaction.setOfferId(offer.getId());
        offer.getTransactions().add(transaction);

        // transaction entity to DB
        transactionRepo.save(transaction);

        return transaction;
    }

    @Override
    public List<Transaction> retrieveTransactionsByStatus(List<String> statuses) throws NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            if (statuses != null) {
                List<PaymentStatus> ps = new ArrayList<>();
                if(statuses.size() == 0) {
                    return retrieveAllTransactions();
                }
                for (String s : statuses) {
                    String upper = s.toUpperCase();
                    ps.add(PaymentStatus.valueOf(upper));
                }
                List<Transaction> transactions = transactionRepo.findByPaymentStatusIn(ps);
                return transactions;
            } else {
                return transactionRepo.findAll();
            }
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public List<Transaction> retrieveTransactionsByOfferId(Long offerId) throws OfferNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Offer offer = offerRepo.findById(offerId).orElseThrow(
                () -> new OfferNotFoundException("Offer id: " + offerId + " does not exist."));

        AppUser refashioner = offer.getAppUser();

        List<Transaction> transactions = offer.getTransactions();
        return transactions;

    }

    @Override
    public Transaction retrieveTransactionById(Long id) throws TransactionNotFoundException, NoAccessRightsException {
        Optional<Transaction> exists = transactionRepo.findById(id);
        if (exists.isEmpty()) {
            throw new TransactionNotFoundException("Transaction id: " + id + " does not exist.");
        } else {
            Transaction transaction = exists.get();
            Offer offer = offerRepo.getById(transaction.getOfferId());
//            AppUser refashionee = appUserService.getUser(offer.getRefashioneeUsername());
            AppUser user = appUserService.getUser(userService.getCurrentUsername());

            if (offer.getSwapRequesterUsername() == null) { // if swapitem this field will be occupied by other fields will be empty and fetch null error
                AppUser refashionee = appUserService.getUser(offer.getRefashioneeUsername());

                if (user.getOffers().contains(offer) || user.equals(refashionee) || user.getUsername().equals(offer.getAppUser().getUsername()) || user.getUsername().equals(offer.getRefashioneeUsername()) || user.getRoles().contains(Role.valueOf("ADMIN"))) { //not offered by you + you are not the refashioner in charge

                    return exists.get();
                } else {
                    throw new NoAccessRightsException("You do not have access to this method!");
                }
            } else {
                if (user.getUsername().equals(offer.getSwapRequesterUsername())) {
                    return exists.get();
                } else {
                    throw new NoAccessRightsException("You do not have access to this method!");
                }
            }
        }
    }

    @Override
    public List<Transaction> retrieveAllTransactions() {
        return transactionRepo.findAll();
    }

    @Override
    public String deleteTransaction(Long id) throws TransactionNotFoundException, NoAccessRightsException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            Transaction transaction = retrieveTransactionById(id);
            transactionRepo.deleteById(id);
            return "Transaction deleted successfully, id: " + id;
        }
        throw new NoAccessRightsException("You do not have access to this method!");
    }

    @Override
    public Transaction rejectTransaction(Long transactionId) throws TransactionNotFoundException, TransactionAlreadyCompletedException, NoAccessRightsException {

        Transaction transaction = retrieveTransactionById(transactionId);

        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
            throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot be declined.");
        }

        transaction.setPaymentStatus(PaymentStatus.DECLINED);
        log.info("Rejecting current transaction: " + transactionId);
        transactionRepo.save(transaction);
        return transaction;
    }

    @Override
    public Transaction holdTransaction(Long transactionId) throws TransactionNotFoundException, TransactionAlreadyCompletedException, NoAccessRightsException {
        Transaction transaction = retrieveTransactionById(transactionId);

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
                throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot be held.");
            }
            transaction.setPaymentStatus(PaymentStatus.HOLD);
            log.info("Placing on hold the current transaction: " + transactionId);
            transactionRepo.save(transaction);
            return transaction;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public Transaction acceptMPLTransaction(Long transactionId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, ChatNotFoundException {
        Transaction transaction = retrieveTransactionById(transactionId);

        //Cannot accept transactions
        if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
            throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot go through.");
        }
        transaction.setPaymentStatus(PaymentStatus.COMPLETED); //once accepted, create a new order
        transaction.setDateCompleted(new Date());
        log.info("Completed Transaction: " + transactionId);

        //Create a new order
        Order2 order = new Order2();
        Offer offer = offerRepo.getById(transaction.getOfferId());

        order.setOfferTitle(offer.getTitle());
        order.setOfferType(offer.getOfferType());
        order.setOfferId(transaction.getOfferId());
        order.setTransactionId(transaction.getId());
        order.setOrderPrice(transaction.getAmount());
        order.setOrderTime(transaction.getDateCompleted());
        order.setProposedCompletionDate(offer.getProposedCompletionDate());
//            order.setAppUserUsername(userService.getCurrentUsername());

        order.setBuyerUsername(offer.getBuyerUsername());
        order.setSellerUsername(offer.getSellerUsername());
        order.setRefashionerUsername(offer.getSellerUsername());
        order.setAppUserUsername(offer.getBuyerUsername());

        //update marketplace transaction
        Integer initialQty = offer.getMarketplaceListing().getQuantity();
        Integer purchasedQty = offer.getQuantity();
        offer.getMarketplaceListing().setQuantity(initialQty - purchasedQty);
        MarketplaceListing marketplaceListing = offer.getMarketplaceListing();
        marketplaceListing.setQuantity(initialQty - purchasedQty);
        if (initialQty - purchasedQty == 0) {
            marketplaceListing.setInstock(false);
        }

        offerRepo.save(offer);
        marketplaceListingRepo.save(marketplaceListing);



        AppUser buyer = appUserService.getUser(userService.getCurrentUsername());
        AppUser seller = offer.getAppUser();

        String chatId = chat2Service.generateChatAlternativeId(buyer.getId(), seller.getId(), Optional.ofNullable(offer.getMarketplaceListing().getId()));
        order.setChatAlternateId(chatId);
        order2Repo.save(order);
        transaction.setOrder2(order);
        ChatMessage2 newMessage = new ChatMessage2("I have accepted your offer and paid the sum: SGD$" + offer.getPrice().toString(), buyer.getUsername(), seller.getUsername(), Optional.empty(), false, chatId, true);
      
        Chat2 chat = chat2Service.getChat(chatId);
        chat.addOrder(order);
        chat2Repository.save(chat);

        chat2Service.sendMessage(seller.getUsername(), newMessage, Optional.of(offer.getMarketplaceListing().getId()), null);

        Milestone milestone = new Milestone();
        milestone.setMilestoneEnum(MilestoneEnum.ORDER_STARTED);
        milestone.setRemarks("ALT-INV-" + order.getId().toString());
        milestone.setOrderId(order.getId());
        milestone.setOfferId(transaction.getOfferId());
        milestone.setDate(transaction.getDateCompleted());
        milestoneRepo.save(milestone);
        List<Milestone> milestoneList = order.getMilestones();
        milestoneList.add(milestone);
        order.setMilestones(milestoneList);

        transactionRepo.save(transaction);
        return transaction;
    }

    public Transaction acceptEventTransaction(Long transactionId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException {
        Transaction transaction = retrieveTransactionById(transactionId);

        //Cannot accept transactions
        if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
            throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot go through.");
        }
        transaction.setPaymentStatus(PaymentStatus.COMPLETED); //once accepted, create a new order
        transaction.setDateCompleted(new Date());
        log.info("Completed Transaction: " + transactionId);

        //Create a new order
        Order2 order = new Order2();
        Offer offer = offerRepo.getById(transaction.getOfferId());

        order.setOfferTitle(offer.getTitle());
        order.setOfferType(offer.getOfferType());
        order.setOfferId(transaction.getOfferId());
        order.setTransactionId(transaction.getId());
        order.setOrderPrice(transaction.getAmount());
        order.setOrderTime(transaction.getDateCompleted());
        order.setProposedCompletionDate(offer.getProposedCompletionDate());
//            order.setAppUserUsername(userService.getCurrentUsername());

        order.setEventParticipantUsername(offer.getEventParticipantUsername());
        order.setTicketsPurchasedForEvent(offer.getQuantity());

        order2Repo.save(order);
        transaction.setOrder2(order);
        transactionRepo.save(transaction);
        return transaction;
    }

    public Transaction acceptSwapRequestTransaction(Long transactionId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException {
        Transaction transaction = retrieveTransactionById(transactionId);

        //Cannot accept transactions
        if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
            throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot go through.");
        }
        transaction.setPaymentStatus(PaymentStatus.COMPLETED); //once accepted, create a new order
        transaction.setDateCompleted(new Date());
        log.info("Completed Transaction: " + transactionId);

        return transaction;
    }

    @Override
    public Transaction acceptSwapOutTransaction(Long transactionId, Long orderId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, OrderNotFoundException {
        Transaction transaction = retrieveTransactionById(transactionId);
        Offer offer = offerRepo.getById(transaction.getOfferId());
        Order2 order2 = order2Service.retrieveOrderById(orderId);
//        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
            throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot go through.");
        }
        transaction.setPaymentStatus(PaymentStatus.COMPLETED); //once accepted, create a new order
        transaction.setDateCompleted(new Date());
        log.info("Completed Transaction: " + transactionId);

        transaction.setOrder2(order2);

        //Create a new milestone associated with order

        Milestone milestone = new Milestone();
        milestone.setMilestoneEnum(MilestoneEnum.SWAP_DELIVERY_PAID);
        milestone.setRemarks("ALT-INV-" + order2.getId().toString());
        milestone.setOrderId(order2.getId());
        milestone.setOfferId(transaction.getOfferId());
        milestone.setDate(transaction.getDateCompleted());
        milestoneRepo.save(milestone);
        List<Milestone> milestoneList = order2.getMilestones();
        milestoneList.add(milestone);
        order2.setMilestones(milestoneList);

        transactionRepo.save(transaction);
        return transaction;
    }

    @Override
    public Transaction acceptTransaction(Long transactionId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, ChatNotFoundException {
        Transaction transaction = retrieveTransactionById(transactionId);
        Offer offer = offerRepo.getById(transaction.getOfferId());
        if (offer.getMarketplaceListing() != null) {
            return acceptMPLTransaction(transactionId);
        }

        //Cannot accept transactions
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
            throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot go through.");
        }
        transaction.setPaymentStatus(PaymentStatus.COMPLETED); //once accepted, create a new order
        transaction.setDateCompleted(new Date());
        log.info("Completed Transaction: " + transactionId);

        //Create a new order
        Order2 order = new Order2();
        order.setOfferTitle(offer.getTitle());
        order.setOfferId(transaction.getOfferId());
        order.setTransactionId(transaction.getId());
        order.setOrderPrice(transaction.getAmount());
        order.setOrderTime(transaction.getDateCompleted());
        order.setProposedCompletionDate(offer.getProposedCompletionDate());
        order.setOfferType(offer.getOfferType());
//            order.setAppUserUsername(userService.getCurrentUsername());

        AppUser tempUser = offer.getAppUser();
        order.setRefashionerUsername(tempUser.getUsername());
        order.setAppUserUsername(offer.getRefashioneeUsername());

        Project topic = offer.getProjectRequest();
        Long topicId = null;
        if (topic != null) {
            topicId = topic.getId();
        }
        if (topic == null) {
            topic = (Project) offer.getProjectListing();
            topicId = topic.getId();
        }

        String chatId = "";

        chatId = chat2Service.generateChatAlternativeId(user.getId(), tempUser.getId(), Optional.ofNullable(topicId));

        Chat2 chat = chat2Service.getChat(chatId);
        order.setChatAlternateId(chatId);
        order2Repo.save(order);
        chat.addOrder(order);
        chat2Repository.save(chat);

        ChatMessage2 newMessage = new ChatMessage2("I have accepted your offer entitled: " + offer.getTitle() + " and paid the sum: SGD$" + offer.getPrice().toString(), user.getUsername(), tempUser.getUsername(), Optional.empty(), false, chatId, true);

//        chat2Service.sendMessage(tempUser.getUsername(), newMessage, Optional.of(topic), null);
        chat2Service.sendMessage(tempUser.getUsername(), newMessage, Optional.of(topicId), null);

        transaction.setOrder2(order);

        //Create a new milestone associated with order
        Milestone milestone = new Milestone();
        milestone.setMilestoneEnum(MilestoneEnum.ORDER_STARTED);
        milestone.setRemarks("ALT-INV-" + order.getId().toString());
        milestone.setOrderId(order.getId());
        milestone.setOfferId(transaction.getOfferId());
        milestone.setDate(transaction.getDateCompleted());
        milestoneRepo.save(milestone);
        List<Milestone> milestoneList = order.getMilestones();
        milestoneList.add(milestone);
        order.setMilestones(milestoneList);

        transactionRepo.save(transaction);
        return transaction;

    }

    @Override
    public Transaction acceptAddOnTransaction(Long transactionId, Long orderId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, OfferNotFoundException, OrderNotFoundException, AddOnNotFoundException {
        Transaction transaction = retrieveTransactionById(transactionId);
        Offer offer = offerService.retrieveOfferById(transaction.getOfferId());
        Order2 order = order2Service.retrieveOrderById(orderId);
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());

        AddOn addOn = new AddOn();
        addOnRepo.save(addOn);
        addOn.setTitle(offer.getTitle());
        addOn.setOfferType(offer.getOfferType());
        addOn.setDescription(offer.getDescription());
        addOn.setPrice(offer.getPrice());
        addOn.setAddOnStatus(AddOnStatus.ACCEPTED);
        addOn.setProposedCompletionDate(offer.getProposedCompletionDate());
        addOn.setRefashioneeUsername(offer.getRefashioneeUsername());
        addOn.setOfferId(offer.getId());
        addOn.setOrderId(orderId);
        order.getAddOns().add(addOn);
        addOnRepo.save(addOn);
        order2Repo.save(order);

        if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
            throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot go through.");
        }

        transaction.setPaymentStatus(PaymentStatus.COMPLETED); //once accepted, create a new order
        transaction.setDateCompleted(new Date());
        transaction.setOrder2(order);

        log.info("Completed Transaction: " + transactionId);

        Milestone milestone = new Milestone();
        milestone.setMilestoneEnum(MilestoneEnum.ADD_ON_ORDER_STARTED);
        milestone.setRemarks("ALT-INV-" + addOn.getId().toString());
        milestone.setOrderId(order.getId());
        milestone.setOfferId(transaction.getOfferId());
        milestone.setDate(transaction.getDateCompleted());
        milestone.setAddOnId(addOn.getId());
        milestoneRepo.save(milestone);
        List<Milestone> milestoneList = order.getMilestones();
        milestoneList.add(milestone);
        order.setMilestones(milestoneList);

//        AppUser buyer = appUserService.getUser(userService.getCurrentUsername());
//        AppUser seller = offer.getAppUser();

//        String chatId = chat2Service.generateChatAlternativeId(buyer.getId(), seller.getId(), Optional.ofNullable(offer.getMarketplaceListing().getId()));
//
//        ChatMessage2 newMessage = new ChatMessage2("I have accepted your offer and paid the sum: SGD$" + offer.getPrice().toString(), buyer.getUsername(), Optional.empty(), false, chatId, true);
//
//        chat2Service.sendMessage(seller.getUsername(), newMessage, Optional.of(offer.getMarketplaceListing().getId()), null);

        transactionRepo.save(transaction);
        return transaction;
    }

    @Override
    public Transaction acceptDeliveryTransaction(Long transactionId, Long deliveryId, Long orderId, String token) throws DeliveryNotFoundException, NoAccessRightsException, TransactionNotFoundException, OrderNotFoundException, TransactionAlreadyCompletedException, JNTDeliveryCreationError {
        Delivery d = deliveryService.retrieveDeliveryById(deliveryId);
        Transaction transaction = retrieveTransactionById(transactionId);
        Order2 order = order2Service.retrieveOrderById(orderId);

        if (transaction.getPaymentStatus() == PaymentStatus.COMPLETED || transaction.getPaymentStatus() == PaymentStatus.DECLINED) {
            throw new TransactionAlreadyCompletedException("Transaction id: " + transactionId + " with status: " + transaction.getPaymentStatus() + " cannot go through.");
        }

        transaction.setPaymentStatus(PaymentStatus.COMPLETED); //once accepted, create a new order
        transaction.setDateCompleted(new Date());
        transaction.setOrder2(order);

        log.info("Completed Transaction: " + transactionId);

        String trackingNumber = deliveryService.createJNTDelivery(token, deliveryId);

        transactionRepo.save(transaction);
        return transaction;
    }
}
