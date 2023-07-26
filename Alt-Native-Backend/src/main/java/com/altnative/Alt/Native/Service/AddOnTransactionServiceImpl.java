//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Enum.MilestoneEnum;
//import com.altnative.Alt.Native.Enum.PaymentStatus;
//import com.altnative.Alt.Native.Enum.Role;
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Model.*;
//import com.altnative.Alt.Native.Repository.*;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import javax.transaction.Transactional;
//import java.util.Date;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//@Slf4j
//public class AddOnTransactionServiceImpl implements AddOnTransactionService {
//
//    private final AddOnTransactionRepo addOnTransactionRepo;
//    private final AddOnRepo addOnRepo;
//    private final AddOnOrderRepo addOnOrderRepo;
//    private final MilestoneRepo milestoneRepo;
//    private final AppUserService appUserService;
//    private final UserService userService;
//    private final OfferService offerService;
//
//    @Override
//    public AddOnTransaction createAddOnTransaction(Long addOnId, AddOnTransaction addOnTransaction) throws InvalidAddOnTransactionException, CreditCardNotFoundException, AddOnNotFoundException, OfferNotFoundException, NoAccessRightsException {
////        // retrieve credit card entity by id
////        CreditCard creditCard = creditCardRepo.findById(ccId).orElseThrow(
////                () -> new CreditCardNotFoundException("Credit Card id: " + ccId + " does not exist."));
//
//        // retrieve add-on entity by id
//        AddOn addOn = addOnRepo.findById(addOnId).orElseThrow(
//                () -> new AddOnNotFoundException("Add On id: " + addOnId + " does not exist."));
//
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//        String username = currUser.getUsername();
//        Long offerId = addOn.getOfferId();
//        Offer offer = offerService.retrieveOfferById(offerId);
//        String refashionee = offer.getRefashioneeUsername();
//
//        if (currUser.getUsername().equals(refashionee) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//
////            addOnTransaction.setCreditCard(creditCard);
//            addOnTransaction.setOfferId(addOn.getId());
//            addOnTransaction.setOrderId(addOn.getOrderId());
//            addOnTransaction.setAmount(addOnTransaction.getAmount());
//            addOnTransaction.setDateCreated(addOnTransaction.getDateCreated());
//            addOnTransaction.setAddOnId(addOnTransaction.getId());
//            addOn.getAddOnTransactions().add(addOnTransaction);
////            creditCard.getAddOnTransactions().add(addOnTransaction);
//
//            // transaction entity to DB
//            addOnTransactionRepo.save(addOnTransaction);
//            return addOnTransaction;
//        }
//        throw new NoAccessRightsException("You do not have access to this method!");
//    }
//
////    @Override
////    public List<AddOnTransaction> retrieveAddOnTransactionsByCreditCardId(Long creditCardId) throws CreditCardNotFoundException, OfferNotFoundException, NoAccessRightsException {
////        // retrieve credit card entity by id
////        CreditCard cc = creditCardRepo.findById(creditCardId).orElseThrow(
////                () -> new CreditCardNotFoundException("Credit Card id: " + creditCardId + " does not exist."));
////
////        // retrieve add-on transactions by creditCardId
////        List<AddOnTransaction> addOnTransactions = addOnTransactionRepo.findByCreditCardId(creditCardId);
////
////        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
////        String username = currUser.getUsername();
////        //Use anyone transaction to get the refashionee name
////        AddOnTransaction addOnTransaction = addOnTransactions.get(0); //get the first one
////        Long offerId = addOnTransaction.getOfferId();
////        Offer offer = offerService.retrieveOfferById(offerId);
////        String refashionee = offer.getRefashioneeUsername();
////
////        // return transactions associated with credit card
////        if (currUser.getUsername().equals(refashionee) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
////            return addOnTransactions;
////        }
////        throw new NoAccessRightsException("You do not have access to this method!");
////    }
//
//    @Override
//    public List<AddOnTransaction> retrieveAddOnTransactionsByAddOnId(Long addOnId) throws AddOnNotFoundException, OfferNotFoundException, NoAccessRightsException {
//        // retrieve credit card entity by id
//        AddOn addOn = addOnRepo.findById(addOnId).orElseThrow(
//                () -> new AddOnNotFoundException("AddOn id: " + addOnId + " does not exist."));
//
//        // retrieve add-on transactions by AddOnId
//        List<AddOnTransaction> addOnTransactions = addOnTransactionRepo.findByAddOnId(addOnId);
//
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//        String username = currUser.getUsername();
//        //Use anyone transaction to get the refashionee name
//        AddOnTransaction addOnTransaction = addOnTransactions.get(0); //get the first one
//        Long offerId = addOnTransaction.getOfferId();
//        Offer offer = offerService.retrieveOfferById(offerId);
//        String refashionee = offer.getRefashioneeUsername();
//        AppUser refashioner = offer.getAppUser();
//
//        if (currUser.getUsername().equals(refashionee) || currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.equals(refashioner)) {
//            return addOnTransactions;
//        }
//        throw new NoAccessRightsException("You do not have access to this method!");
//    }
//
//    @Override
//    public List<AddOnTransaction> retrieveAllAddOnTransactions() {
//        return addOnTransactionRepo.findAll();
//    }
//
//    @Override
//    public AddOnTransaction retrieveAddOnTransactionById(Long id) throws AddOnTransactionNotFoundException, OfferNotFoundException, NoAccessRightsException {
//        Optional<AddOnTransaction> exists = addOnTransactionRepo.findById(id);
//        if (exists.isEmpty()) {
//            throw new AddOnTransactionNotFoundException("Add-On transaction id: " + id + " does not exist.");
//        } else {
//            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//            String username = currUser.getUsername();
//            //Use anyone transaction to get the refashionee name
//            AddOnTransaction addOnTransaction = exists.get();
//            Long offerId = addOnTransaction.getOfferId();
//            Offer offer = offerService.retrieveOfferById(offerId);
//            String refashionee = offer.getRefashioneeUsername();
//            AppUser refashioner = offer.getAppUser();
//
//            if (currUser.getUsername().equals(refashionee) || currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.equals(refashioner)) {
//                return exists.get();
//            }
//            throw new NoAccessRightsException("You do not have access to this method!");
//        }
//    }
//
//    @Override
//    public String deleteAddOnTransaction(Long id) throws AddOnTransactionNotFoundException, NoAccessRightsException, OfferNotFoundException {
//        AddOnTransaction transaction = retrieveAddOnTransactionById(id);
//
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//            addOnTransactionRepo.deleteById(id);
//            return "Add-On Transaction deleted successfully, id: " + id;
//        }
//        throw new NoAccessRightsException("You do not have access to this method!");
//    }
//
//    @Override
//    public AddOnTransaction rejectAddOnTransaction(Long addOnTransactionId) throws AddOnTransactionNotFoundException, AddOnTransactionAlreadyCompletedException, NoAccessRightsException, OfferNotFoundException {
//        AddOnTransaction addOnTransaction = retrieveAddOnTransactionById(addOnTransactionId);
//
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//            if (addOnTransaction.getPaymentStatus() == PaymentStatus.COMPLETED || addOnTransaction.getPaymentStatus() == PaymentStatus.DECLINED) {
//                throw new AddOnTransactionAlreadyCompletedException("Add-On transaction id: " + addOnTransactionId + " with status: " + addOnTransaction.getPaymentStatus() + " cannot be declined.");
//            }
//
//            addOnTransaction.setPaymentStatus(PaymentStatus.DECLINED);
//            log.info("Rejecting current transaction: " + addOnTransactionId);
//            addOnTransactionRepo.save(addOnTransaction);
//            return addOnTransaction;
//        }
//        throw new NoAccessRightsException("You do not have access to this method!");
//    }
//
//    @Override
//    public AddOnTransaction holdAddOnTransaction(Long addOnTransactionId) throws AddOnTransactionNotFoundException, AddOnTransactionAlreadyCompletedException, NoAccessRightsException, OfferNotFoundException {
//        AddOnTransaction addOnTransaction = retrieveAddOnTransactionById(addOnTransactionId);
//
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//
//        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//            if (addOnTransaction.getPaymentStatus() == PaymentStatus.COMPLETED || addOnTransaction.getPaymentStatus() == PaymentStatus.DECLINED) {
//                throw new AddOnTransactionAlreadyCompletedException("Add-On transaction id: " + addOnTransactionId + " with status: " + addOnTransaction.getPaymentStatus() + " cannot be held.");
//            }
//
//            addOnTransaction.setPaymentStatus(PaymentStatus.HOLD);
//            log.info("Holding current transaction: " + addOnTransactionId);
//            addOnTransactionRepo.save(addOnTransaction);
//            return addOnTransaction;
//        }
//        throw new NoAccessRightsException("You do not have access to this method!");
//    }
//
//    @Override
//    public AddOnTransaction acceptAddOnTransaction(Long addOnTransactionId) throws AddOnTransactionNotFoundException, AddOnTransactionAlreadyCompletedException, NoAccessRightsException, OfferNotFoundException {
//        AddOnTransaction addOnTransaction = retrieveAddOnTransactionById(addOnTransactionId);
//        Long offerId = addOnTransaction.getOfferId();
//        Offer offer = offerService.retrieveOfferById(offerId);
//
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//
//        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//            //Cannot accept transactions
//            if (addOnTransaction.getPaymentStatus() == PaymentStatus.COMPLETED || addOnTransaction.getPaymentStatus() == PaymentStatus.DECLINED) {
//                throw new AddOnTransactionAlreadyCompletedException("Add-On Transaction id: " + addOnTransactionId + " with status: " + addOnTransaction.getPaymentStatus() + " cannot go through.");
//            }
//            addOnTransaction.setPaymentStatus(PaymentStatus.COMPLETED); //once accepted, create a new order
//            addOnTransaction.setDateCompleted(new Date());
//            log.info("Completed Add-On Transaction: " + addOnTransactionId);
//
//            //Create a new order
//            AddOnOrder addOnOrder = new AddOnOrder();
//            addOnOrder.setOfferId(addOnTransaction.getOfferId());
//            addOnOrder.setOrderId(addOnTransaction.getOrderId());
//            addOnOrder.setAddOnId(addOnTransaction.getAddOnId());
//            addOnOrder.setAddOnTransactionId(addOnTransaction.getId());
//            addOnOrder.setPrice(addOnTransaction.getAmount());
//            addOnOrder.setAddOnOrderTime(addOnTransaction.getDateCompleted());
//            addOnOrder.setRefashionerUsername(offer.getAppUser().getUsername());
//            addOnOrder.setAppUserUsername(offer.getRefashioneeUsername());
//            addOnOrderRepo.save(addOnOrder);
//            addOnTransaction.setAddOnOrder(addOnOrder);
//
//            //Create a new milestone associated with order
//            Milestone milestone = new Milestone();
//            milestone.setMilestoneEnum(MilestoneEnum.ADD_ON_ORDER_STARTED);
//            milestone.setAddOnOrderId(addOnOrder.getId());
//            milestone.setAddOnId(addOnOrder.getAddOnId());
//            milestone.setDate(addOnOrder.getAddOnOrderTime());
//            milestoneRepo.save(milestone);
//            List<Milestone> milestoneList = addOnOrder.getMilestones();
//            milestoneList.add(milestone);
//            addOnOrder.setMilestones(milestoneList);
//
//            addOnTransactionRepo.save(addOnTransaction);
//            return addOnTransaction;
//        }
//        throw new NoAccessRightsException("You do not have access to this method!");
//    }
//
//}
