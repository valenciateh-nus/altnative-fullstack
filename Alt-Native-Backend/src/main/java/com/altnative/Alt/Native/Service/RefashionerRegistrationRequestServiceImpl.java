package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Enum.PaymentStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.AppUserRepo;
import com.altnative.Alt.Native.Repository.ExperienceRepo;
import com.altnative.Alt.Native.Repository.RefashionerRegistrationRequestRepo;
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
public class RefashionerRegistrationRequestServiceImpl implements RefashionerRegistrationRequestService {
    private final RefashionerRegistrationRequestRepo refashionerRegistrationRequestRepo;
    private final AppUserRepo appUserRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final ImageService imageService;
    private final ExperienceRepo experienceRepo;

    @Override
    public RefashionerRegistrationRequest createRefashionerRegistrationRequest(RefashionerRegistrationRequest refashionerRegistrationRequest, List<MultipartFile> files) throws RefashionerRegistrationRequestFailedException, InvalidFileException, S3Exception {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (user.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
            throw new RefashionerRegistrationRequestFailedException("You are already a refashioner!");
        }

        RefashionerRegistrationRequest newReq = new RefashionerRegistrationRequest();
        newReq.setRefashionerDesc(refashionerRegistrationRequest.getRefashionerDesc());
        newReq.setTraits(refashionerRegistrationRequest.getTraits());
        newReq.setUser(user);
        newReq.setRejected(Boolean.FALSE);

        if (refashionerRegistrationRequest.getExpertises().size() > 0) {
            for (Experience exp : refashionerRegistrationRequest.getExpertises()) {
                Experience newExp = new Experience();
                newExp.setName(exp.getName());
                newExp.setExperienceLevel(exp.getExperienceLevel());
                newExp.setRefashioner(user);
                newExp.setRefashioner(user);
                experienceRepo.save(newExp);
                newReq.getExpertises().add(newExp);
            }
        }

        if (files != null) { //there are images for certifications
            for (int i = 0; i < files.size(); i++) {
                String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
                String filename = String.format("%s-%s", UUID.randomUUID(), files.get(i).getOriginalFilename());
                Image newImage = new Image();
                newImage.setPath(path);
                newImage.setFileName(filename);
                newImage = imageService.createImage(newImage, files.get(i));
                newReq.getCertifications().add(newImage);
            }
        }

        newReq.setRequestDate(Calendar.getInstance().getTime());
        user.getRefashionerRegistrationRequests().add(newReq);

        refashionerRegistrationRequestRepo.save(newReq);
        return newReq;
    }

    @Override
    public void approveRefashionerRegistrationRequestWithCertifications(Long refashionerRegistrationRequestId, List<String> certifiedCertifications) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException, RefashionerRegistrationRequestFailedException {

        //admin will be able to take in a string of certifications they approve for the user
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            RefashionerRegistrationRequest refashionerRegistrationRequest = retrieveRefashionerRegistrationRequestById(refashionerRegistrationRequestId);
            AppUser userToBeRefashioner = refashionerRegistrationRequest.getUser();

            //check if already approved before
            if (userToBeRefashioner.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
                throw new RefashionerRegistrationRequestFailedException("User is already a refashioner!");
            }

            if (!certifiedCertifications.isEmpty()) {
                userToBeRefashioner.setApprovedCertifications(certifiedCertifications);
            }

            if (refashionerRegistrationRequest.getRefashionerDesc() != null) {
                userToBeRefashioner.setRefashionerDesc(refashionerRegistrationRequest.getRefashionerDesc());
            }

            //else proceed
            refashionerRegistrationRequest.setVerified(Boolean.TRUE);
            refashionerRegistrationRequest.setVerifiedDate(Calendar.getInstance().getTime());

            userToBeRefashioner.setApprovedRefashionerRegistrationRequestId(refashionerRegistrationRequestId);
            if (refashionerRegistrationRequest.getExpertises() != null) {
                for (Experience e : refashionerRegistrationRequest.getExpertises()) {
                    userToBeRefashioner.getExpertises().add(e);
                }
            }

            userToBeRefashioner.getRoles().add(Role.valueOf("USER_REFASHIONER"));

            refashionerRegistrationRequestRepo.save(refashionerRegistrationRequest);
            appUserRepo.save(userToBeRefashioner);
//            if (rrr.getCertifications() != null) {
//                for (Image i : rrr.getCertifications()) {
//                    userToBeRefashioner.getCertifications().add(i);
//                }
//            }
//            if (rrr.getExperiences() != null) {
//                for (Experience e : rrr.getExperiences()) {
//                    userToBeRefashioner.getExperiences().add(e);
//                    e.setRefashioner(userToBeRefashioner);
//                }
//            }
//            appUserRepo.flush();
//            refashionerRegistrationRequestRepo.flush();
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public void addRefashionerCertification(Long refashionerId, String certification) throws NotARefashionerException, NoAccessRightsException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            AppUser refashionerToUpdate = appUserService.getUserById(refashionerId);
            if (refashionerToUpdate.getRoles().contains(Role.USER_REFASHIONER)) {
                List<String> approvedCertifications = refashionerToUpdate.getApprovedCertifications();
                approvedCertifications.add(certification);
                refashionerToUpdate.setApprovedCertifications(approvedCertifications);
                appUserRepo.save(refashionerToUpdate);
            } else {
                throw new NotARefashionerException("User with id: " + refashionerId + " is not a refashioner!");
            }
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }


    @Override
    public void approveRefashionerRegistrationRequest(Long rrrId) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException, RefashionerRegistrationRequestFailedException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            RefashionerRegistrationRequest rrr = retrieveRefashionerRegistrationRequestById(rrrId);
            AppUser userToBeRefashioner = rrr.getUser();

            if (userToBeRefashioner.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
                throw new RefashionerRegistrationRequestFailedException("User is already a refashioner!");
            }

            rrr.setVerified(Boolean.TRUE);
            rrr.setRejected(Boolean.FALSE);
            rrr.setVerifiedDate(Calendar.getInstance().getTime());

            if (rrr.getRefashionerDesc().length() > 0) {
                userToBeRefashioner.setRefashionerDesc(rrr.getRefashionerDesc());
            }
            if (!rrr.getCertifications().isEmpty()) {
                for (Image i : rrr.getCertifications()) {
                    userToBeRefashioner.getCertifications().add(i);
                }
            }
            if (!rrr.getExpertises().isEmpty()) {
                for (Experience e : rrr.getExpertises()) {
                    userToBeRefashioner.getExpertises().add(e);
                }
            }
            if (!rrr.getTraits().isEmpty()) {
                for (String s : rrr.getTraits()) {
                    userToBeRefashioner.getTraits().add(s);
                }
            }
//            userToBeRefashioner.setExpertises(rrr.getExpertises());
//            userToBeRefashioner.setTraits(rrr.getTraits());
            userToBeRefashioner.setApprovedRefashionerRegistrationRequestId(rrr.getId());
            userToBeRefashioner.getRoles().add(Role.valueOf("USER_REFASHIONER"));
            appUserRepo.save(userToBeRefashioner);

        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public void rejectRefashionerRegistrationRequest(Long rrrId) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException, RefashionerRegistrationRequestFailedException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        if (loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            RefashionerRegistrationRequest rrr = retrieveRefashionerRegistrationRequestById(rrrId);
            log.info("Current rrr has request: " + rrr.getRejected());
            rrr.setRejected(Boolean.TRUE); //only time this will be set to true
            AppUser user = rrr.getUser();
            List<Experience> expertises = loggedInUser.getExpertises();
            if (expertises.size() > 0) { //not empty
                for (Experience exp: expertises) {
                    experienceRepo.delete(exp);
                }
            }
            user.setExpertises(new ArrayList<>());
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
//            rrr.setVerifiedDate(Calendar.getInstance().getTime());
//            if (rrr.getRejected().equals(Boolean.TRUE) || rrr.getRejected() == true || rrr.getRejected().equals("true")) {
//                throw new RefashionerRegistrationRequestFailedException("Refashioner registration request with id: " + rrrId + " has been rejected previously already!");
//            }
//
    }

    @Override
    public List<RefashionerRegistrationRequest> retrieveRefashionerRegistrationRequestsByUserId(Long userId) throws NoRefashionerRegistrationRequestExistsException {
        AppUser user = appUserService.getUserById(userId);
        if (user.getRefashionerRegistrationRequests().isEmpty()) {
            throw new NoRefashionerRegistrationRequestExistsException("User with id: " + userId + " has not made any refashioner registration requests yet.");
        } else {
            return user.getRefashionerRegistrationRequests();
        }
    }

    @Override
    public List<RefashionerRegistrationRequest> retrieveRejectedRefashionerRegistrationRequestsByUserId(Long userId) throws NoRefashionerRegistrationRequestExistsException {
        AppUser user = appUserService.getUserById(userId);
        if (user.getRefashionerRegistrationRequests().isEmpty()) {
            throw new NoRefashionerRegistrationRequestExistsException("User with id: " + userId + " has not made any refashioner registration requests yet.");
        } else {
            List<RefashionerRegistrationRequest> requests = user.getRefashionerRegistrationRequests();
            List<RefashionerRegistrationRequest> rejectedReq = new ArrayList<>();
            for (RefashionerRegistrationRequest request : requests) {
                if (request.getRejected() == null) { //not checked
                    continue;
                }
                if (request.getRejected().equals(Boolean.TRUE)) {
                    rejectedReq.add(request);
                }
            }
            return rejectedReq;
        }
    }

    @Override
    public RefashionerRegistrationRequest retrieveRefashionerRegistrationRequestById(Long id) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());

        Optional<RefashionerRegistrationRequest> rrr = refashionerRegistrationRequestRepo.findById(id);
        if (rrr.isEmpty()) {
            throw new RefashionerRegistrationRequestNotFoundException("RefashionerRegistrationRequest with ID: " + id + " not found.");
        } else {
            RefashionerRegistrationRequest request = rrr.get();
            //can retrieve if admin or is the person applying for the refashioner status
            if (request.getUser().equals(loggedInUser) || loggedInUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                return request;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public List<RefashionerRegistrationRequest> retrieveAllRefashionerRegistrationRequests() throws NoRefashionerRegistrationRequestExistsException {
        List<RefashionerRegistrationRequest> rrrList = refashionerRegistrationRequestRepo.findAll();
        if (rrrList.isEmpty()) {
            throw new NoRefashionerRegistrationRequestExistsException("There are no refashioner registration requests.");
        } else {
            return rrrList;
        }
    }

    @Override
    public RefashionerRegistrationRequest updateRefashionerRegistrationRequest(RefashionerRegistrationRequest refashionerRegistrationRequest) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        Optional<RefashionerRegistrationRequest> rrrOpt = refashionerRegistrationRequestRepo.findById(refashionerRegistrationRequest.getId());
        if (rrrOpt.isEmpty()) {
            throw new RefashionerRegistrationRequestNotFoundException("RefashionerRegistrationRequest with ID: " + refashionerRegistrationRequest.getId() + " not found.");
        } else {
            RefashionerRegistrationRequest rrr = rrrOpt.get();

            if (rrr.getUser().equals(user) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
                if (refashionerRegistrationRequest.getExpertises() != null && !refashionerRegistrationRequest.getExpertises().isEmpty()) {
                    rrr.setExpertises(refashionerRegistrationRequest.getExpertises());
                }
//                if (refashionerRegistrationRequest.getExperiences() != null && !refashionerRegistrationRequest.getExperiences().isEmpty()) {
//                    rrr.setExperiences(refashionerRegistrationRequest.getExperiences());
//                }
                if (refashionerRegistrationRequest.getCertifications() != null && !refashionerRegistrationRequest.getCertifications().isEmpty()) {
                    rrr.setCertifications(refashionerRegistrationRequest.getCertifications());
                }
                if (refashionerRegistrationRequest.getRefashionerDesc() != null && refashionerRegistrationRequest.getRefashionerDesc().length() > 0) {
                    rrr.setRefashionerDesc(refashionerRegistrationRequest.getRefashionerDesc());
                }
                refashionerRegistrationRequestRepo.save(rrr);
                return rrr;
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    @Override
    public void deleteRefashionerRegistrationRequestById(Long id) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        Optional<RefashionerRegistrationRequest> rrrOpt = refashionerRegistrationRequestRepo.findById(id);
        if (rrrOpt.isEmpty()) {
            throw new RefashionerRegistrationRequestNotFoundException("RefashionerRegistrationRequest with ID: " + id + " not found.");
        } else {
            RefashionerRegistrationRequest rrr = rrrOpt.get();
            if (user.getApprovedRefashionerRegistrationRequestId() == null || !user.getApprovedRefashionerRegistrationRequestId().equals(rrr) || !user.getRoles().contains(Role.valueOf("ADMIN"))) {
                throw new NoAccessRightsException("You do not have access to this method!");
            } else {
                refashionerRegistrationRequestRepo.deleteById(id);
                refashionerRegistrationRequestRepo.flush();
            }
        }
    }

    @Override
    public Integer retrieveNoOfNewRefashioners(DateDto dates) {
        LocalDate startDate = LocalDate.parse(dates.getStart());
        LocalDate endDate = LocalDate.parse(dates.getEnd());
        endDate = endDate.plusDays(1);
        Date startDate1 = java.sql.Date.valueOf(startDate);
        Date endDate1 = java.sql.Date.valueOf(endDate);
        List<RefashionerRegistrationRequest> requests = refashionerRegistrationRequestRepo.findAllByVerifiedDateBetweenAndAndVerifiedTrue(startDate1, endDate1);
        return requests.size();
    }
}
