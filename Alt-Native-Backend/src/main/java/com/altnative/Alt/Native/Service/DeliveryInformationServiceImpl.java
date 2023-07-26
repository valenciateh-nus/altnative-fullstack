//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Enum.Role;
//import com.altnative.Alt.Native.Exceptions.DeliveryInformationNotFoundException;
//import com.altnative.Alt.Native.Exceptions.InvalidDeliveryInformationException;
//import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
//import com.altnative.Alt.Native.Exceptions.OrderNotFoundException;
//import com.altnative.Alt.Native.Model.AppUser;
//import com.altnative.Alt.Native.Model.DeliveryInformation;
//import com.altnative.Alt.Native.Model.Order2;
//import com.altnative.Alt.Native.Repository.AppUserRepo;
//import com.altnative.Alt.Native.Repository.DeliveryInformationRepo;
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
//public class DeliveryInformationServiceImpl implements DeliveryInformationService {
//
//    private final DeliveryInformationRepo deliveryInformationRepo;
//    private final AppUserService appUserService;
//    private final UserService userService;
//    private final AppUserRepo appUserRepo;
//    private final Order2Service order2Service;
//
//    @Override
//    public DeliveryInformation createDeliveryInformationWithOrderId(Long orderId) throws InvalidDeliveryInformationException, OrderNotFoundException {
//        Optional<Order2> order2Optional = order2Service.retrieveOrderById(orderId);
//        if (order2Optional.isEmpty()) {
//            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
//        }
//        Order2 order = order2Optional.get();
//        String refashionerAdd = appUserService.getUser(order.getRefashionerUsername()).getAddress();
//        String refashioneeAdd = appUserService.getUser(order.getAppUserUsername()).getAddress();
//
//        DeliveryInformation deliveryInformation = new DeliveryInformation();
//        deliveryInformation.
//
//        log.info("Saving new delivery information to db:", deliveryInformation);
//        deliveryInformationRepo.save(deliveryInformation);
//        return deliveryInformation;
//    }
//
//    @Override
//    public DeliveryInformation retrieveDeliveryInformationByTrackingNumber(String trackingNumber) throws DeliveryInformationNotFoundException, NoAccessRightsException {
//        DeliveryInformation deliveryInformation = deliveryInformationRepo.findByTrackingNumber(trackingNumber);
////        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
////        if (!appUser.getDeliveryInformation().contains(deliveryInformation) || !appUser.getRoles().contains(Role.ADMIN)) {
////            throw new NoAccessRightsException("You do not have the access rights to do this method!");
////        }
//
//        if (deliveryInformation != null) {
//            return deliveryInformation;
//        } else {
//            throw new DeliveryInformationNotFoundException("Delivery Information with tracking number " + trackingNumber + " does not exist.");
//        }
//    }
//
//    @Override
//    public List<DeliveryInformation> retrieveAllDeliveryInformation() {
//        return deliveryInformationRepo.findAll();
//    }
//
//    @Override
//    public DeliveryInformation retrieveDeliveryInformationById(Long id) throws DeliveryInformationNotFoundException, NoAccessRightsException {
//        Optional<DeliveryInformation> deliveryInformation = deliveryInformationRepo.findById(id);
//        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
////        if (!appUser.getDeliveryInformation().contains(deliveryInformation) || !appUser.getRoles().contains(Role.ADMIN)) {
////            throw new NoAccessRightsException("You do not have the access rights to do this method!");
////        }
//        if (deliveryInformation.isEmpty()) {
//            throw new DeliveryInformationNotFoundException("Delivery Information with ID " + id + " does not exist.");
//        } else {
//            return deliveryInformation.get();
//        }
//    }
//
//    @Override
//    public String deleteDeliveryInformation(Long id) throws DeliveryInformationNotFoundException, NoAccessRightsException {
//        DeliveryInformation deliveryInformation = retrieveDeliveryInformationById(id);
//        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
//        if (appUser.getDeliveryInformation().contains(deliveryInformation) || appUser.getRoles().contains(Role.ADMIN)) {
//            if (deliveryInformation == null) {
//                throw new DeliveryInformationNotFoundException("Delivery Information with ID " + id + " does not exist.");
//            }
//            deliveryInformationRepo.deleteById(id);
//            return "Delivery Information with ID " + id + " deleted successfully.";
//        } else {
//            throw new NoAccessRightsException("You do not have the access rights to do this method!");
//        }
//    }
//
//    @Override
//    public DeliveryInformation updateDeliveryInformation(DeliveryInformation newDeliveryInformation) throws DeliveryInformationNotFoundException, NoAccessRightsException {
//        Optional<DeliveryInformation> deliveryInformationOptional = deliveryInformationRepo.findById(newDeliveryInformation.getId());
//        if (deliveryInformationOptional.isEmpty()) {
//            throw new DeliveryInformationNotFoundException("Delivery information with ID: " + newDeliveryInformation.getId() + " not found.");
//        } else {
//            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
//            DeliveryInformation deliveryInformation = deliveryInformationOptional.get();
//
//            if (appUser.getDeliveryInformation().contains(deliveryInformation) || appUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//                deliveryInformation.setTrackingNumber(newDeliveryInformation.getTrackingNumber());
//                deliveryInformation.setOrigin(newDeliveryInformation.getOrigin());
//                deliveryInformation.setDestination(newDeliveryInformation.getDestination());
//                deliveryInformationRepo.save(deliveryInformation);
//                return deliveryInformation;
//            }
//            throw new NoAccessRightsException("You do not have the access rights to do this method!");
//        }
//    }
//}
