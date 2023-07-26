//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Enum.AddOnStatus;
//import com.altnative.Alt.Native.Enum.MilestoneEnum;
//import com.altnative.Alt.Native.Enum.Role;
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Model.*;
//import com.altnative.Alt.Native.Repository.AddOnOrderRepo;
//import com.altnative.Alt.Native.Repository.MilestoneRepo;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import javax.transaction.Transactional;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//@Slf4j
//public class AddOnOrderServiceImpl implements AddOnOrderService {
//
//    private final AddOnOrderRepo addOnOrderRepo;
//    private final UserService userService;
//    private final OfferService offerService;
//    private final AppUserService appUserService;
//    private final MilestoneRepo milestoneRepo;
//
//    @Override
//    public String retrieveInvoiceNumber(Long addOnOrderId) throws AddOnOrderNotFoundException, NoAccessRightsException, OfferNotFoundException {
//        Optional<AddOnOrder> order = addOnOrderRepo.findById(addOnOrderId);
//
//        if (order.isEmpty()) {
//            log.info("Add-On Order does not exist.");
//            throw new AddOnOrderNotFoundException("Add-On Order not found, id: " + addOnOrderId);
//        } else {
//            Long offerId = order.get().getOfferId();
//            Offer offer = offerService.retrieveOfferById(offerId);
//            String refashionee = offer.getRefashioneeUsername();
//            AppUser refashioner = offer.getAppUser();
//            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//
////            if (!refashionee.equals(currUser.getUsername())|| !refashioner.equals(currUser) || !currUser.getRoles().contains(Role.ADMIN)) {
////                throw new NoAccessRightsException("You do not have the access to this method!");
////            }
//
//            if (currUser.getUsername().equals(refashionee) || currUser.equals(refashioner) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//                String invoiceNumber = "ALT-INV-" + offerId.toString() + "-" + addOnOrderId.toString();
//                return invoiceNumber;
//            } else {
//                throw new NoAccessRightsException("You do not have the access to this method!");
//            }
//        }
//    }
//
//    @Override
//    public AddOnOrder retrieveAddOnOrderById(Long id) throws AddOnOrderNotFoundException, NoAccessRightsException, OfferNotFoundException {
//        Optional<AddOnOrder> order = addOnOrderRepo.findById(id);
//
//        if (order.isEmpty()) {
//            log.info("Add-On Order does not exist.");
//            throw new AddOnOrderNotFoundException("Add-On Order not found, id: " + id);
//        } else {
//            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//            String username = currUser.getUsername();
//            Long offerId = order.get().getOfferId();
//            Offer offer = offerService.retrieveOfferById(offerId);
//            String refashionee = offer.getRefashioneeUsername();
//            AppUser refashioner = offer.getAppUser(); //refashioner of the entire order
//
//            if (currUser.getUsername().equals(refashionee) || currUser.equals(refashioner) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//                return order.get();
//            }
//            throw new NoAccessRightsException("You do not have the access to this method!");
//        }
//    }
//
//    @Override
//    public List<AddOnOrder> retrieveAllAddOnOrders() {
//        return addOnOrderRepo.findAll();
//    }
//
//    @Override
//    public AddOnOrder updateAddOnOrder(AddOnOrder newAddOnOrder) throws AddOnOrderNotFoundException, NoAccessRightsException, OfferNotFoundException {
//        Optional<AddOnOrder> currOrder = addOnOrderRepo.findById(newAddOnOrder.getId());
//        if (currOrder.isEmpty()) {
//            throw new AddOnOrderNotFoundException("Add-On Order listing with id: " + newAddOnOrder.getId() + " not found!");
//        } else {
//            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//            String username = currUser.getUsername();
//            Long offerId = currOrder.get().getOfferId();
//            Offer offer = offerService.retrieveOfferById(offerId);
//            AppUser refashioner = offer.getAppUser(); //refashioner of the entire order
//            String refashionee = offer.getRefashioneeUsername();
//
//            if (currUser.getUsername().equals(refashionee) || currUser.equals(refashioner) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//                AddOnOrder addOnOrderToUpdate = currOrder.get();
//                addOnOrderToUpdate.setAddOnStatus(newAddOnOrder.getAddOnStatus());
//                addOnOrderToUpdate.setMilestones(newAddOnOrder.getMilestones());
//                addOnOrderToUpdate.setPrice(newAddOnOrder.getPrice());
//                addOnOrderToUpdate.setOfferId(newAddOnOrder.getOfferId());
//                addOnOrderToUpdate.setAddOnTransactionId(newAddOnOrder.getAddOnTransactionId());
//                addOnOrderToUpdate.setOrderId(newAddOnOrder.getOrderId());
//
//                //Remember to add in time
//
//                addOnOrderRepo.save(addOnOrderToUpdate);
//
//                return addOnOrderToUpdate ;
//            }
//            throw new NoAccessRightsException("You do not have the access to this method!");
//        }
//    }
//
//    @Override
//    public AddOnOrder completeAddOnOrder(Long addOnOrderId) throws AddOnOrderNotFoundException, NoAccessRightsException {
//
//        Optional<AddOnOrder> order = addOnOrderRepo.findById(addOnOrderId);
//
//        if (order.isEmpty()) {
//            throw new AddOnOrderNotFoundException("Add-On Order with id: " + addOnOrderId + " not found!");
//        } else {
//            AddOnOrder addOnOrder = order.get();
//            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
//            AppUser refashionee = appUserService.getUser(addOnOrder.getAppUserUsername());
//            AppUser refashioner = appUserService.getUser(addOnOrder.getRefashionerUsername());
//
//            //Refashionee should be able to mark the order as complete upon receipt of items
//            if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN")) || loggedInUser.equals(refashionee)) {
//                addOnOrder.setAddOnStatus(AddOnStatus.PRODUCT_COMPLETED);
//                List<Milestone> orderMilestones = addOnOrder.getMilestones();
//                Milestone finalMilestone = new Milestone();
//                finalMilestone.setOfferId(addOnOrder.getOfferId());
//                finalMilestone.setAddOnOrderId(addOnOrderId);
//                finalMilestone.setMilestoneEnum(MilestoneEnum.ADD_ON_ORDER_COMPLETE);
//                milestoneRepo.save(finalMilestone);
//
//                orderMilestones.add(finalMilestone);
//                addOnOrder.setMilestones(orderMilestones);
//                addOnOrderRepo.save(addOnOrder);
//                return addOnOrder;
//            } else {
//                throw new NoAccessRightsException("You do not have access to this method!");
//            }
//        }
//    }
//
//
//}
