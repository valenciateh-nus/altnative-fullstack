package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Enum.*;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.DisputeRepo;
import com.altnative.Alt.Native.Repository.MilestoneRepo;
import com.altnative.Alt.Native.Repository.Order2Repo;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import com.amazonaws.services.ecr.model.ImageNotFoundException;
import com.stripe.model.Refund;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class DisputeServiceImpl implements DisputeService {

    private final DisputeRepo disputeRepo;
    private final Order2Repo order2Repo;
    private final Order2Service order2Service;
    private final MilestoneRepo milestoneRepo;
    private final MilestoneService milestoneService;
    private final CheckoutService checkoutService;
    private final ImageService imageService;
    private final AppUserService appUserService;
    private final UserService userService;
    private final Chat2Service chat2Service;

    @Override
    public Dispute createDispute(Long orderId, Dispute dispute, List<MultipartFile> photos) throws OrderNotFoundException, NoAccessRightsException, InvalidRefundAmountException, InvalidFileException, S3Exception {
        Order2 order = order2Service.retrieveOrderById(orderId);
        dispute.setOrderId(order.getId());
        dispute.setDateCreated(new Date());
        // retrieve latest milestone
        Milestone milestone = order.getMilestones().get(order.getMilestones().size() - 1);
//        if (!milestone.getMilestoneEnum().equals(MilestoneEnum.FINAL_APPROVAL_OK)) {
//            throw new NoAccessRightsException("You are not allowed to create a dispute.");
//        }
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        if (order.getOrderPrice() < dispute.getRefundAmount()) {
            throw new InvalidRefundAmountException("Your refund amount is greater than order price. Please set a lower number.");
        }
        if (photos != null) {
            for (int i = 0; i < photos.size(); i++) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), loggedInUser.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), photos.get(i).getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, photos.get(i));
                dispute.getPhotos().add(newImage);
            }
        }
        //Both buyer and seller can create a dispute
        //E.g. Case 1: Buyer is unsatisfied
        //E.g. Case 2: Buyer refuses to accept an item, seller disputes
        if (order.getBuyerUsername() != null) { //marketplace listing
            //Check if user is involved in the order
            if (order.getBuyerUsername().equals(loggedInUser.getUsername()) || order.getSellerUsername().equals(loggedInUser.getUsername())) {
                dispute.setBuyerUsername(order.getBuyerUsername());
                dispute.setSellerUsername(order.getSellerUsername());
                dispute.setAppUser(loggedInUser);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        } else { // project listing/request
            if (order.getAppUserUsername().equals(loggedInUser.getUsername()) || order.getRefashionerUsername().equals(loggedInUser.getUsername())) {
                dispute.setRefashioneeUsername(order.getAppUserUsername());
                dispute.setRefashionerUsername(order.getRefashionerUsername());
                dispute.setAppUser(loggedInUser);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        }
        dispute.setDisputeStatus(DisputeStatus.DISPUTE_REQUEST_PENDING_REVIEW); //REVIEWED BY OPPOSING PARTY FIRST
        Dispute dispute1 = disputeRepo.save(dispute);

        loggedInUser.getDisputes().add(dispute1);
        order.getDisputes().add(dispute1);
        Milestone disputeMilestone = new Milestone();
        disputeMilestone.setDisputeId(dispute1.getId());
        disputeMilestone.setMilestoneEnum(MilestoneEnum.DISPUTE_REQUEST_PENDING_REVIEW);
        disputeMilestone.setRemarks(dispute.getDescription());

        Milestone disputeMilestone1 = milestoneService.createMilestone(null, disputeMilestone, order.getId());
        System.out.println("dispute milestone id" + disputeMilestone1.getId());
        return dispute1;
    }

    @Override
    public String deleteDispute(Long disputeId) throws DisputeNotFoundException, NoAccessRightsException {
        Optional<Dispute> dispute = disputeRepo.findById(disputeId);
        if (dispute.isEmpty()) {
            throw new DisputeNotFoundException("Dispute with id: " + disputeId + " not found!");
        } else {
            Dispute disputeToDelete = dispute.get();
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            if (user.getUsername().equals(disputeToDelete.getAppUser().getUsername())) {
                user.getDisputes().remove(disputeToDelete);
                Optional<Order2> order = order2Repo.findById(disputeToDelete.getOrderId());
                order.get().getDisputes().remove(disputeToDelete);
                List<Milestone> disputeMilestones = milestoneRepo.findByDisputeId(disputeId);
                for (Milestone m : disputeMilestones) {
                    order.get().getMilestones().remove(m);
                    milestoneRepo.delete(m);
                }
                disputeRepo.delete(disputeToDelete);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        }
        return "Successfully deleted dispute with id: " + disputeId;
    }

    @Override
    public Dispute editDispute(Long id, Dispute newDispute) throws
            DisputeNotFoundException, NoAccessRightsException {
        //this method can only be used if the project request has status DISPUTE_REQUEST_PENDING_REVIEW
        Optional<Dispute> dispute = disputeRepo.findById(id);
        if (dispute.isEmpty()) {
            throw new DisputeNotFoundException("Dispute with id: " + newDispute.getId() + " not found!");
        } else {
            Dispute disputeToUpdate = dispute.get();
            if (disputeToUpdate.getDisputeStatus() != DisputeStatus.DISPUTE_REQUEST_PENDING_REVIEW) {
                throw new NoAccessRightsException("Dispute with id: " + newDispute.getId() + " has status " + newDispute.getDisputeStatus() + ". It cannot be modified.");
            }
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            AppUser userInDraft = disputeToUpdate.getAppUser();

            if (user.equals(userInDraft) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                disputeToUpdate.setAdminRemarks(newDispute.getAdminRemarks());
                disputeToUpdate.setDescription(newDispute.getDescription());
                disputeToUpdate.setRefundAmount(newDispute.getRefundAmount());

                disputeRepo.save(disputeToUpdate);
                return disputeToUpdate;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public Dispute retrieveDisputeByDisputeId(Long disputeId) throws DisputeNotFoundException, NoAccessRightsException {
        Optional<Dispute> dispute = disputeRepo.findById(disputeId);
        if (dispute.isEmpty()) {
            throw new DisputeNotFoundException("Dispute with id: " + disputeId + " not found!");
        } else {
            Dispute currDispute = dispute.get();
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            Optional<Order2> order = order2Repo.findById(currDispute.getOrderId());
            if (user.getRoles().contains(Role.ADMIN) || user.getUsername().equals(currDispute.getBuyerUsername()) || user.getUsername().equals(currDispute.getSellerUsername())
                    || user.getUsername().equals(currDispute.getRefashionerUsername()) || user.getUsername().equals(currDispute.getRefashioneeUsername())) {
                return currDispute;
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        }
    }

    // retrieve disputes that are either REJECTED or ACCEPTED but refund failed
    @Override
    public List<Dispute> retrievePendingReviewDisputes() throws NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.ADMIN)) {
            List<Dispute> disputes = new ArrayList<>();
            disputes.addAll(disputeRepo.findByDisputeStatusIn(Arrays.asList(DisputeStatus.REFUND_FAILED, DisputeStatus.DISPUTE_REQUEST_REJECTED)));
            return disputes;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        }
    }

    @Override
    public List<Dispute> retrieveListOfDisputes() throws NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.ADMIN)) {
            List<Dispute> disputes = disputeRepo.findAll();
            return disputes;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        }
    }

    // admin filters accepted and rejected disputes
    @Override
    public List<Dispute> filterDisputesByStatus(Optional<String[]> statuses) throws NoAccessRightsException {
        Set<Dispute> disputes = new HashSet<>();
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.ADMIN)) {
            if (statuses.isPresent()) {
                List<String> statusStr = Arrays.asList(statuses.get());
                List<DisputeStatus> rs = new ArrayList<>();
                for (String s : statusStr) {
                    rs.add(DisputeStatus.valueOf(s));
                }
                disputes.addAll(disputeRepo.findByDisputeStatusIn(rs));
            }
            List<Dispute> disputes2 = new ArrayList<>();
            disputes2.addAll(disputes);
            return disputes2;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        }
    }

    @Override
    public List<Dispute> retrieveListOfDisputesByUserId(Long appUserId) throws
            UserDoesNotExistException {
        List<Dispute> disputes = disputeRepo.findAllDisputesByUserId(appUserId);
        return disputes;
    }

    @Override
    public List<Dispute> retrieveDisputesOfOrder(Long orderId) throws
            OrderNotFoundException, NoAccessRightsException {
        Optional<Order2> order2Optional = order2Repo.findById(orderId);
        if (order2Optional.isEmpty()) {
            throw new OrderNotFoundException("Order with ID: " + orderId + " not found!");
        } else {
            Order2 order = order2Optional.get();
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            AppUser buyer = null;
            AppUser seller = null;
            AppUser refashioner = null;
            AppUser refashionee = null;
            if (order.getOfferType().equals(OfferType.MARKETPLACE_LISTING)) {
                buyer = appUserService.getUser(order.getBuyerUsername());
                seller = appUserService.getUser(order.getSellerUsername());
            } else {
                refashioner = appUserService.getUser(order.getRefashionerUsername());
                refashionee = appUserService.getUser(order.getAppUserUsername());
            }
            if (loggedInUser.equals(refashionee) || loggedInUser.equals(refashioner) || loggedInUser.equals(buyer) || loggedInUser.equals(seller) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                List<Dispute> disputes = order.getDisputes();
                return disputes;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public Dispute editDispute(Dispute newDispute) throws DisputeNotFoundException, NoAccessRightsException {
        Optional<Dispute> dispute = disputeRepo.findById(newDispute.getId());
        if (dispute.isEmpty()) {
            throw new DisputeNotFoundException("Dispute with id: " + newDispute.getId() + " not found!");
        } else {
            Dispute disputeToUpdate = dispute.get();
            AppUser user = appUserService.getUser(userService.getCurrentUsername());
            if (user.equals(disputeToUpdate.getAppUser()) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                if (disputeToUpdate.getDisputeStatus().equals(DisputeStatus.DISPUTE_REQUEST_PENDING_REVIEW)) {
                    disputeToUpdate.setDescription(newDispute.getDescription());
                    disputeToUpdate.setRefundAmount(newDispute.getRefundAmount());
                } else {
                    throw new NoAccessRightsException("This dispute can no longer be edited.");
                }
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
            disputeRepo.save(disputeToUpdate);
            return disputeToUpdate;
        }
    }

    @Override
    public void addImageToDispute(Long disputeId, MultipartFile file) throws
            DisputeNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Dispute> exists = disputeRepo.findById(disputeId);
        if (exists.isEmpty()) {
            throw new DisputeNotFoundException("Dispute id: " + disputeId + " does not exist.");
        } else {
            Dispute dispute = exists.get();
            if (!dispute.getDisputeStatus().equals(DisputeStatus.DISPUTE_REQUEST_PENDING_REVIEW)) {
                throw new NoAccessRightsException("This dispute can no longer be edited.");
            }
            if (user.equals(dispute.getAppUser()) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, file);
                dispute.getPhotos().add(newImage);
                disputeRepo.save(dispute);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public void removeImageFromDispute(Long disputeId, Long imageId) throws
            DisputeNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Optional<Dispute> exists = disputeRepo.findById(disputeId);
        if (exists.isEmpty()) {
            throw new DisputeNotFoundException("Dispute id: " + disputeId + " does not exist.");
        } else {
            Dispute dispute = exists.get();
            if (!dispute.getDisputeStatus().equals(DisputeStatus.DISPUTE_REQUEST_PENDING_REVIEW)) {
                throw new NoAccessRightsException("This dispute can no longer be edited.");
            }
            if (user.equals(dispute.getAppUser()) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                List<Image> disputeImages = dispute.getPhotos();
                boolean found = false;
                for (Image image : disputeImages) {
                    log.info("current image id" + image.getId() + " while the inserted id is " + imageId);
                    if (image.getId() == imageId || image.getId().equals(imageId)) {
                        log.info("the image has been found");
                        found = true;
                        disputeImages.remove(image);
                        imageService.deleteImage(image);
                        break;
                    }
                }
                if (!found) { //not found
                    throw new ImageNotFoundException("Dispute does not contain this image!");
                }
                dispute.setPhotos(disputeImages);
                disputeRepo.save(dispute);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to this method!");
            }
        }
    }

    @Override
    public Dispute acceptDispute(Long disputeId) throws Exception {
        //for opposing party to approve only
        Dispute disputeToAccept = retrieveDisputeByDisputeId(disputeId);
        String username = userService.getCurrentUsername();
        if (disputeToAccept.getAppUser().getUsername().equals(username)) { //cannot be creator
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        } else {
            //straight to refund
            disputeToAccept.setDisputeStatus(DisputeStatus.DISPUTE_REQUEST_ACCEPTED);
            Milestone disputeMilestone = new Milestone();
            disputeMilestone.setDisputeId(disputeToAccept.getId());
            disputeMilestone.setMilestoneEnum(MilestoneEnum.DISPUTE_REQUEST_ACCEPTED);

            milestoneService.createMilestone(null, disputeMilestone, disputeToAccept.getOrderId());
            Dispute disputeToAccept1 = disputeRepo.saveAndFlush(disputeToAccept);

            Refund refund = checkoutService.createRefund(disputeToAccept.getId());
            Milestone m = new Milestone();
            m.setDisputeId(disputeToAccept1.getId());
            if (refund.getStatus().equalsIgnoreCase("succeeded")) {
                disputeToAccept1.setDisputeStatus(DisputeStatus.DISPUTE_REQUEST_ACCEPT_COMPLETED);
                disputeToAccept1.setDateCompleted(new Date());
                disputeToAccept1.setAdminRemarks("Item has been refunded with the amount: SGD $" + disputeToAccept1.getRefundAmount());
                m.setMilestoneEnum(MilestoneEnum.DISPUTE_REQUEST_COMPLETED);
                milestoneService.createMilestone(null, m, disputeToAccept1.getOrderId());
            } else {
                disputeToAccept1.setDisputeStatus(DisputeStatus.REFUND_FAILED);
                disputeToAccept1.setAdminRemarks("Refund has failed. Please wait for assistance from admin.");
                m.setMilestoneEnum(MilestoneEnum.DISPUTE_REQUEST_PENDING_ADMIN_REVIEW);
                milestoneService.createMilestone(null, m, disputeToAccept1.getOrderId());
            }
            return disputeRepo.save(disputeToAccept1);
        }
    }

    @Override
    public Dispute rejectDispute(Long disputeId, String rejectRemarks) throws
            DisputeNotFoundException, NoAccessRightsException, OrderNotFoundException {
        Dispute disputeToReject = retrieveDisputeByDisputeId(disputeId);
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        String username = user.getUsername();
        if (disputeToReject.getAppUser().getUsername().equals(username) || disputeToReject.getDisputeStatus().equals(DisputeStatus.DISPUTE_REQUEST_ACCEPTED)) { //cannot be creator
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        } else {
            disputeToReject.setRejectRemarks(rejectRemarks);
            //pending administrator follow up
            disputeToReject.setDisputeStatus(DisputeStatus.DISPUTE_REQUEST_REJECTED);
            Order2 order = order2Service.retrieveOrderById(disputeToReject.getOrderId());
            Milestone disputeMilestone = new Milestone();
            disputeMilestone.setOrderId(order.getId());
            disputeMilestone.setOfferId(order.getOfferId());
            disputeMilestone.setDisputeId(disputeToReject.getId());
            disputeMilestone.setMilestoneEnum(MilestoneEnum.DISPUTE_REQUEST_PENDING_ADMIN_REVIEW);
            disputeMilestone.setDate(Calendar.getInstance().getTime());

            Milestone disputeMilestone1 = milestoneRepo.save(disputeMilestone);
            order.getMilestones().add(disputeMilestone1);

            order2Repo.save(order);
            disputeRepo.save(disputeToReject);
            disputeRepo.flush();
            return disputeToReject;
        }
    }

    @Override
    public void settleDispute(Long disputeId) throws
            DisputeNotFoundException, NoAccessRightsException {
        Dispute dispute = retrieveDisputeByDisputeId(disputeId);
        //create a chat between administrator and both parties
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        if (loggedInUser.getRoles().contains(Role.ADMIN)) {
            //topic id will be the dispute id
            Long topicId = disputeId;
            AppUser recipient;
            AppUser recipient2;
            String chatId;
            String chatId2;
            if (dispute.getRefashionerUsername().isEmpty()) {
                recipient = appUserService.getUser(dispute.getBuyerUsername());
                chatId = chat2Service.generateChatAlternativeId(loggedInUser.getId(), recipient.getId(), Optional.ofNullable(topicId));
                recipient2 = appUserService.getUser(dispute.getSellerUsername());
                chatId2 = chat2Service.generateChatAlternativeId(loggedInUser.getId(), recipient2.getId(), Optional.ofNullable(topicId));
            } else {
                recipient = appUserService.getUser(dispute.getRefashionerUsername());
                chatId = chat2Service.generateChatAlternativeId(loggedInUser.getId(), recipient.getId(), Optional.ofNullable(topicId));
                recipient2 = appUserService.getUser(dispute.getRefashioneeUsername());
                chatId2 = chat2Service.generateChatAlternativeId(loggedInUser.getId(), recipient2.getId(), Optional.ofNullable(topicId));
            }
            ChatMessage2 newMessage = new ChatMessage2("I will now be reviewing the dispute request." + " Reason: " + "Dispute request has been refuted by opposing party for your order.", loggedInUser.getUsername(), recipient.getUsername(), Optional.empty(), false, chatId, false);
            chat2Service.sendMessage(recipient.getUsername(), newMessage, Optional.of(topicId), null);
            ChatMessage2 newMessage2 = new ChatMessage2("I will now be reviewing the dispute request." + " Reason: " + "Dispute request has been refuted by opposing party for your order.", loggedInUser.getUsername(), recipient2.getUsername(), Optional.empty(), false, chatId2, false);
            chat2Service.sendMessage(recipient2.getUsername(), newMessage2, Optional.of(topicId), null);
        } else {
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        }
    }

    // admin voids a dispute i.e no refund is made
    @Override
    public Dispute endDispute(Long disputeId, String adminRemarks) throws
            DisputeNotFoundException, NoAccessRightsException, OrderNotFoundException {
        Dispute dispute = retrieveDisputeByDisputeId(disputeId);
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (user.getRoles().contains(Role.ADMIN)) {
            dispute.setAdminRemarks(adminRemarks);
            dispute.setDateCompleted(new Date());
            dispute.setDisputeStatus(DisputeStatus.DISPUTE_REQUEST_COMPLETED);
            Order2 order = order2Service.retrieveOrderById(dispute.getOrderId());
            Milestone disputeMilestone = new Milestone();
            disputeMilestone.setOrderId(order.getId());
            disputeMilestone.setOfferId(order.getOfferId());
            disputeMilestone.setDisputeId(dispute.getId());
            disputeMilestone.setMilestoneEnum(MilestoneEnum.DISPUTE_REQUEST_COMPLETED);
            disputeMilestone.setDate(Calendar.getInstance().getTime());

            Milestone disputeMilestone1 = milestoneRepo.save(disputeMilestone);
            order.getMilestones().add(disputeMilestone1);

            order2Repo.save(order);
            disputeRepo.save(dispute);
            disputeRepo.flush();
            return dispute;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        }
    }

    @Override
    public Dispute updateDisputeStatus(Long disputeId, String adminRemarks, DisputeStatus newStatus, MilestoneEnum
            newMilestone) throws DisputeNotFoundException, NoAccessRightsException, OrderNotFoundException {
        Dispute dispute = retrieveDisputeByDisputeId(disputeId);
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (user.getRoles().contains(Role.ADMIN)) {
            dispute.setAdminRemarks(adminRemarks);
            dispute.setDisputeStatus(newStatus);

            Order2 order = order2Service.retrieveOrderById(dispute.getOrderId());
            Milestone disputeMilestone = new Milestone();
            disputeMilestone.setOrderId(order.getId());
            disputeMilestone.setOfferId(order.getOfferId());
            disputeMilestone.setDisputeId(dispute.getId());
            disputeMilestone.setMilestoneEnum(newMilestone);
            disputeMilestone.setDate(Calendar.getInstance().getTime());
            milestoneRepo.save(disputeMilestone);

            disputeRepo.save(dispute);
            disputeRepo.flush();
            return dispute;
        } else {
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        }
    }

    @Override
    public Double retrieveRefundsByDate(DateDto dates) {
        LocalDate startDate = LocalDate.parse(dates.getStart());
        LocalDate endDate = LocalDate.parse(dates.getEnd());
        endDate = endDate.plusDays(1);
        Date startDate1 = java.sql.Date.valueOf(startDate);
        Date endDate1 = java.sql.Date.valueOf(endDate);
        Double refund = 0.0;
        List<DisputeStatus> ds = new ArrayList<>();
        ds.add(DisputeStatus.DISPUTE_REQUEST_ACCEPT_COMPLETED);
        List<Dispute> disputes = disputeRepo.findAllByDateCompletedBetweenAndDisputeStatusIn(startDate1, endDate1, ds);
        for (Dispute d : disputes) {
            refund += d.getRefundAmount();
        }
        return refund;
    }

    @Override
    public Double retrieveRefundsByRefashionerAndDate() {
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DAY_OF_MONTH, -30);
        Date endDate = new Date();
        Date startDate = c.getTime();

        Double refund = 0.0;
        List<DisputeStatus> ds = new ArrayList<>();
        ds.add(DisputeStatus.DISPUTE_REQUEST_ACCEPT_COMPLETED);
        List<Dispute> disputes = disputeRepo.findAllByDateCompletedBetweenAndDisputeStatusIn(startDate, endDate, ds);
        for (Dispute d : disputes) {
            if (d.getRefashionerUsername().equals(userService.getCurrentUsername()) || d.getSellerUsername().equals(userService.getCurrentUsername())) {
                refund += d.getRefundAmount();
            }
        }
        return refund;
    }
}
