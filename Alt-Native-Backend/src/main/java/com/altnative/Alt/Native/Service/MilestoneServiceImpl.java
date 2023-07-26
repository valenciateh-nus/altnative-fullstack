package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.Note;
import com.altnative.Alt.Native.Dto.fcm.DirectNotification;
import com.altnative.Alt.Native.Dto.jnt.Activity;
import com.altnative.Alt.Native.Dto.jnt.Tracking;
import com.altnative.Alt.Native.Enum.MilestoneEnum;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Firebase.FCMService;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MilestoneServiceImpl implements MilestoneService {
    private final MilestoneRepo milestoneRepo;
    private final Order2Repo order2Repo;
    private final AddOnRepo addOnRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final ImageService imageService;
    private final DeliveryRepo deliveryRepo;
    private final FCMService fcmService;

    @Override
    public Milestone createMilestone(List<MultipartFile> files, Milestone milestone, Long orderId) throws OrderNotFoundException, NoAccessRightsException, InvalidFileException, S3Exception {
        Optional<Order2> order2Optional = order2Repo.findById(orderId);

        if (order2Optional.isEmpty()) {
            throw new OrderNotFoundException("Order with ID: " + orderId + " not found!");
        } else {
            Order2 order = order2Optional.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashioner = appUserService.getUser(order.getRefashionerUsername());
            AppUser refashionee = appUserService.getUser(order.getAppUserUsername());

            if (loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {

                if (files != null) {
                    //Add images
                    for (int i = 0; i < files.size(); i++) {
                        String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), loggedInUser.getId());
                        String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                        Image newImage = new Image();
                        newImage.setPath(path);
                        newImage.setFileName(filename);
                        newImage = imageService.createImage(newImage, files.get(i));
                        milestone.getImages().add(newImage);
                    }
                }
                milestone.setDate(Calendar.getInstance().getTime());
                milestone.setOrderId(order.getId());
                milestone.setOfferId(order.getOfferId());
                order.getMilestones().add(milestone);
                sendMilestoneNotification(loggedInUser,refashioner,refashionee,order, "Milestone Updated for order: ALT-INV" + order.getTransactionId());
                return milestoneRepo.save(milestone);
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    private void sendMilestoneNotification(AppUser loggedInUser, AppUser refashioner, AppUser refashionee, Order2 order, String message) {
        String redirect = null;
        DirectNotification dm = new DirectNotification();
        dm.setTitle("ALT-INV" + order.getTransactionId());
        dm.setMessage(message);
        if(order.getChatAlternateId() != null) {
            redirect = "/chat/" + order.getChatAlternateId() + "?user2=" + loggedInUser.getUsername();
        }

        if(loggedInUser.getId() == refashioner.getId()) {
            if(refashionee.getNotificationToken() != null) {
                dm.setTarget(refashionee.getNotificationToken());
                fcmService.sendNotificationToTarget(dm, Optional.ofNullable(redirect));
            }

        } else if(loggedInUser.getId() == refashionee.getId()) {
            if(refashioner.getNotificationToken() != null) {
                dm.setTarget(refashioner.getNotificationToken());
                fcmService.sendNotificationToTarget(dm, Optional.ofNullable(redirect));
            }
        } else {
            dm.setTarget(refashionee.getNotificationToken());
            if(refashionee.getNotificationToken() != null) {
                fcmService.sendNotificationToTarget(dm, Optional.ofNullable(redirect));
            }
            if(refashioner.getNotificationToken() != null) {
                fcmService.sendNotificationToTarget(dm, Optional.ofNullable("/chat/" + order.getChatAlternateId()));
            }
        }
    }

    @Override
    public List<Milestone> retrieveMilestonesForOrder(Long orderId, Optional<String> token) throws OrderNotFoundException, NoMilestoneExistsException, NoAccessRightsException {
        Optional<Order2> order2Optional = order2Repo.findById(orderId);
        if (order2Optional.isEmpty()) {
            throw new OrderNotFoundException("Order with ID: " + orderId + " not found!");
        } else {
            Order2 order = order2Optional.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashioner = appUserService.getUser(order.getRefashionerUsername());
            AppUser refashionee = appUserService.getUser(order.getAppUserUsername());

            if (loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                List<Milestone> milestoneList = new ArrayList<>(order.getMilestones());
                if(token.isPresent()) {
                    for(Delivery delivery : order.getDeliveries()) {
                        if(delivery.getTrackingNumber() == null) {
                            continue;
                        }
                        try {
                            Tracking statuses = getJNTStatus(token.get(), delivery.getTrackingNumber()).block();
                            if(statuses.getActivities() == null) {
                                continue;
                            }
                            for(Activity activity : statuses.getActivities()) {
                                Milestone temp = new Milestone();
                                temp.setOrderId(order.getId());
                                temp.setOfferId(order.getOfferId());
                                temp.setMilestoneEnum(MilestoneEnum.JNT_STATUS);
                                temp.setRemarks(delivery.getTrackingNumber() + ": " + activity.getName());
                                temp.setDate(activity.getCreated_at());
                                milestoneList.add(temp);
                            }
                        } catch (Exception e) {
                            log.error(e.getMessage());
                        }
                    }
                }
                if (milestoneList == null || milestoneList.isEmpty()) {
                    throw new NoMilestoneExistsException("There are no milestones for order id: " + orderId);
                } else {
                    if(token.isPresent()) milestoneList.sort((a,b) -> a.getDate().compareTo(b.getDate()));
                    return milestoneList;
                }
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    private Mono<Tracking> getJNTStatus(String token, String jntTrackingId) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build();
        WebClient webClient = WebClient.builder().exchangeStrategies(strategies).baseUrl("https://uat-jts.jtexpress.sg/jts-service-doorstep").build();
        String path = "/api/gateway/v1/track/" + jntTrackingId;
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path(path)
                        .build())
                .header("Authorization", "JWT " + token)
                .retrieve()
                .bodyToMono(Tracking.class);
    }

//    @Override
//    public List<Milestone> retrieveAllOfferMilestones(Long offerId) throws NoMilestoneExistsException, OfferNotFoundException {
//        Optional<Offer> currOffer = offerRepo.findById(offerId);
//
//        if (currOffer.isEmpty()) {
//            throw new OfferNotFoundException("Offer listing with id: " + offerId + " not found!");
//        }
//
//        List<Milestone> milestoneList = milestoneRepo.findByOfferId(offerId); //arranged in chronological order
//        if (milestoneList.isEmpty()) {
//            throw new NoMilestoneExistsException("There are no milestones in the db.");
//        } else {
//            return milestoneList;
//        }
//    }

    @Override
    public List<Milestone> retrieveAllAddOnMilestones(Long addOnId) throws NoMilestoneExistsException, AddOnNotFoundException {
        Optional<AddOn> currAddOn = addOnRepo.findById(addOnId);

        if (currAddOn.isEmpty()) {
            throw new AddOnNotFoundException("Add-on listing with id: " + addOnId + " not found!");
        }

        List<Milestone> milestoneList = milestoneRepo.findByAddOnId(addOnId); //arranged in chronological order
        if (milestoneList.isEmpty()) {
            throw new NoMilestoneExistsException("There are no milestones in the db.");
        } else {
            return milestoneList;
        }
    }


    @Override
    public Milestone retrieveMilestoneById(Long id) throws MilestoneNotFoundException, NoAccessRightsException {
        Optional<Milestone> milestoneOptional = milestoneRepo.findById(id);
        if (milestoneOptional.isEmpty()) {
            throw new MilestoneNotFoundException("Milestone with ID: " + id + " not found.");
        } else {
            Milestone milestone = milestoneOptional.get();
            Order2 order = order2Repo.findById(milestone.getOrderId()).get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser refashioner = appUserService.getUser(order.getRefashionerUsername());
            AppUser refashionee = appUserService.getUser(order.getAppUserUsername());

            if (loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                return milestone;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

//    @Override
//    public Milestone updateMilestone(Milestone milestone) throws MilestoneNotFoundException, NoAccessRightsException {
//        //redundant method
//        Milestone m = retrieveMilestoneById(milestone.getId());
//
//        Order2 order = order2Repo.findById(m.getOrderId()).get();
//        order.getMilestones().remove(m);
//
//        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
//        AppUser refashioner = appUserService.getUser(order.getRefashionerUsername());
//
//        if (loggedInUser.equals(refashioner) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
//
//            m.setDate(milestone.getDate());
//            m.setAddOnOrder(milestone.getAddOnOrder());
//            m.setRemarks(milestone.getRemarks());
//            m.setId(milestone.getId());
//            m.setImages(milestone.getImages());
//            m.setMilestoneEnum(milestone.getMilestoneEnum());
//            m.setOrderId(milestone.getOrderId());
//            m.setOfferId(milestone.getOfferId());
//
//            order.getMilestones().add(m);
//            milestoneRepo.save(m);
//            milestoneRepo.flush();
//            return m;
//        } else {
//            throw new NoAccessRightsException("You do not have access to this method!");
//        }
//    }

    @Override
    public Milestone updateMilestone(Milestone milestone) throws MilestoneNotFoundException, NoAccessRightsException {
        //redundant method
        Milestone m = retrieveMilestoneById(milestone.getId());

        Order2 order = order2Repo.findById(m.getOrderId()).get();
        //order.getMilestones().remove(m);

        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        AppUser refashioner = appUserService.getUser(order.getRefashionerUsername());
        AppUser refashionee = appUserService.getUser(order.getAppUserUsername());

        if (loggedInUser.getUsername().equals(refashioner.getUsername()) || loggedInUser.getUsername().equals(order.getAppUserUsername()) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {

            m.setDate(milestone.getDate());
            m.setRemarks(milestone.getRemarks());
            m.setId(milestone.getId());
            m.setImages(milestone.getImages());
            m.setMilestoneEnum(milestone.getMilestoneEnum());
            m.setOrderId(milestone.getOrderId());
            m.setOfferId(milestone.getOfferId());

            //order.getMilestones().add(m);
            sendMilestoneNotification(loggedInUser,refashioner,refashionee,order,"Milestone Updated!");
            milestoneRepo.save(m);
            milestoneRepo.flush();
            return m;
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public void deleteMilestoneById(Long id) throws MilestoneNotFoundException, NoAccessRightsException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {

            Milestone m = retrieveMilestoneById(id);
            milestoneRepo.delete(m);
            milestoneRepo.flush();
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

//    @Override
//    public void updateReceiptOfItem(Long id) throws MilestoneNotFoundException, NoAccessRightsException {
//
//        //This is the final receipt of item (refashionee has received the item)
//        //Update order status to completed, milestone to order_complete
//        Milestone m = retrieveMilestoneById(id);
//
//        Order2 order = order2Repo.findById(m.getOrderId()).get();
//        order.getMilestones().remove(m);
//
//        m.setDate(milestone.getDate());
//        m.setAddOnOrder(milestone.getAddOnOrder());
//        m.setRemarks(milestone.getRemarks());
//        m.setId(milestone.getId());
//        m.setImages(milestone.getImages());
//        m.setMilestoneEnum(milestone.getMilestoneEnum());
//        m.setOrderId(milestone.getOrderId());
//        m.setOfferId(milestone.getOfferId());
//
//        order.getMilestones().add(m);
//        milestoneRepo.save(m);
//        milestoneRepo.flush();
//        return m;
//    }
}
