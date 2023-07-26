package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.AppUserRepo;
import com.altnative.Alt.Native.Repository.ProjectListingRepo;
import com.altnative.Alt.Native.Repository.ProjectRequestRepo;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.*;

import static com.altnative.Alt.Native.Enum.Role.USER_REFASHIONER;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RefashionerServiceImpl implements RefashionerService {
    private final AppUserRepo appUserRepo;
    private final ProjectListingRepo projectListingRepo;
    private final ProjectRequestRepo projectRequestRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final ImageService imageService;
    private final Order2Service order2Service;

    // get refashioners by the categories of their project listings
    @Override
    public List<AppUser> getRefashionersByCategories(List<Long> cIds) throws RefashionerNotFoundException {

        List<AppUser> refashioners = new ArrayList<>();
        List<ProjectListing> projectListings = projectListingRepo.findByCategoryIdInAndIsAvailableTrue(cIds);

        if (projectListings.isEmpty()) {
            throw new RefashionerNotFoundException("No Refashioners offer projects with these categories");
        }

        for (ProjectListing p : projectListings) {
            if (!refashioners.contains(p.getRefashioner())) {
                refashioners.add(p.getRefashioner());
            }
        }
        return refashioners;
    }

    // get refashioners based on keywords for username/category/material/tag names
    @Override
    public List<AppUser> getRefashionersByKeyword(String keyword) throws RefashionerNotFoundException {

        List<AppUser> refashioners = appUserRepo.findByRolesInAndUsernameContainingIgnoreCase(Arrays.asList(Role.valueOf("USER_REFASHIONER")), keyword);
        List<ProjectListing> projectListings = projectListingRepo.findByMaterialName(keyword);
        projectListings.addAll(projectListingRepo.findByTagName(keyword));
        projectListings.addAll(projectListingRepo.findByCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(keyword));

        for (ProjectListing p : projectListings) {
            if (!refashioners.contains(p.getRefashioner())) {
                refashioners.add(p.getRefashioner());
            }
        }
        if (refashioners.isEmpty()) {
            throw new RefashionerNotFoundException("No Refashioners found under searched keywords");
        }
        return refashioners;
    }

    // get refashioners who have submitted an offer for a PR
    @Override
    public List<AppUser> retrieveRefashionersOfProjectRequest(Long id) throws ProjectRequestNotFoundException, OfferNotFoundException {

        List<AppUser> refashioners = new ArrayList<>();

        ProjectRequest projectRequest = (ProjectRequest) projectRequestRepo.findById(id).orElseThrow(
                () -> new ProjectRequestNotFoundException("Project Request id: " + id + " does not exist."));

        List<Offer> offers = projectRequest.getOffers();
        if (offers.size() == 0) {
            throw new OfferNotFoundException("No offers have been made for this Project Request");
        }
        for (Offer o : offers) {
            refashioners.add(o.getAppUser());
        }
        return refashioners;
    }

    @Override
    public Experience addExpertise(Experience expertise) throws ExpertiseExistsAlreadyException, UsernameNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Experience newExp = new Experience();
        newExp.setName(expertise.getName());
        newExp.setExperienceLevel(expertise.getExperienceLevel());
        if (user.getExpertises() == null || user.getExpertises().isEmpty()) {
            user.setExpertises(new ArrayList<>());
            user.getExpertises().add(newExp);
            return newExp;
        } else if (user.getExpertises().contains(expertise)) {
            throw new ExpertiseExistsAlreadyException("Expertise: '" + expertise + "' exists already!");
        } else {
            user.getExpertises().add(newExp);
//            appUserRepo.flush();
            return newExp;
        }
    }

    @Override
    public List<Experience> retrieveExpertises() throws NoExpertiseAddedException, UsernameNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getExpertises() == null || user.getExpertises().isEmpty()) {
            user.setExpertises(new ArrayList<>());
            throw new NoExpertiseAddedException("There are no expertises added yet.");
//            return new ArrayList<>();
        } else {
            return user.getExpertises();
        }
    }

    @Override
    public void deleteExpertise(String expertise) throws ExpertiseNotFoundException, UsernameNotFoundException, NoExpertiseAddedException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getExpertises() == null || user.getExpertises().isEmpty()) {
            user.setExpertises(new ArrayList<>());
            throw new NoExpertiseAddedException("There are no expertises added yet.");
//            return new ArrayList<>();
        } else if (user.getExpertises().contains(expertise)) {
            user.getExpertises().remove(expertise);
        } else {
            throw new ExpertiseNotFoundException("Expertise: '" + expertise + "' not found!");
        }
    }

    @Override
    public void deleteAllExpertise() throws UsernameNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        user.setExpertises(new ArrayList<>());
    }

    @Override
    public String addApprovedCertification(String certification, Long refashionerId) throws ApprovedCertificationExistsAlreadyException, UsernameNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        AppUser refashioner = appUserService.getUserById(refashionerId);

        //Only an admin can perform this function
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {

            if (refashioner.getApprovedCertifications() == null || refashioner.getApprovedCertifications().isEmpty()) {
                refashioner.setApprovedCertifications(new ArrayList<>());
                refashioner.getApprovedCertifications().add(certification);
                return certification;
            } else if (refashioner.getApprovedCertifications().contains(certification)) {
                throw new ApprovedCertificationExistsAlreadyException("Certification: '" + certification + "' exists already in the refashioner's approved certifications!");
            } else {
                refashioner.getApprovedCertifications().add(certification);
                //            appUserRepo.flush();
                return certification;
            }
        }
        throw new NoAccessRightsException("You do not have the access rights to do this method!");
    }

    @Override
    public List<String> retrieveApprovedCertifications() throws NoApprovedCertificationsAddedException, UsernameNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        //Anyone can do this
        if (user.getApprovedCertifications() == null || user.getApprovedCertifications().isEmpty()) {
            user.setApprovedCertifications(new ArrayList<>());
            throw new NoApprovedCertificationsAddedException("There are no certifications added yet.");
//            return new ArrayList<>();
        } else {
            return user.getApprovedCertifications();
        }
    }

    @Override
    public void deleteApprovedCertification(String certification) throws ApprovedCertificationNotFoundException, UsernameNotFoundException, NoApprovedCertificationsAddedException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getApprovedCertifications() == null || user.getApprovedCertifications().isEmpty()) {
            user.setApprovedCertifications(new ArrayList<>());
            throw new NoApprovedCertificationsAddedException("There are no certifications added yet.");
//            return new ArrayList<>();
        } else if (user.getApprovedCertifications().contains(certification)) {
            user.getApprovedCertifications().remove(certification);
        } else {
            throw new ApprovedCertificationNotFoundException("Certification: '" + certification + "' not found!");
        }
    }

    @Override
    public void deleteAllApprovedCertifications() throws UsernameNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            user.setApprovedCertifications(new ArrayList<>());
        }
        throw new NoAccessRightsException("You do not have the access rights to do this method!");
    }

    @Override
    public void addCertification(MultipartFile file) throws UsernameNotFoundException, NoAccessRightsException, InvalidFileException, S3Exception {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (user.getRoles().contains(Role.valueOf("USER_REFASHIONER")) || user.getRoles().contains(Role.valueOf("ADMIN"))) {
            String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
            String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
            Image newImage = new Image();
            newImage.setPath(path);
            newImage.setFileName(filename);
            newImage = imageService.createImage(newImage, file);
            if (user.getCertifications() == null || user.getCertifications().isEmpty()) {
                user.setCertifications(new ArrayList<>());
                user.getCertifications().add(newImage);
            } else {
                user.getCertifications().add(newImage);
            }
        } else {
            throw new NoAccessRightsException("You do not have the access rights to this method!");
        }
    }

    @Override
    public List<Image> retrieveCertifications() throws NoCertificationsAddedException, UsernameNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        //Anyone can do this
        if (user.getCertifications() == null || user.getCertifications().isEmpty()) {
            user.setCertifications(new ArrayList<>());
            throw new NoCertificationsAddedException("There are no certifications that you have added yet.");
//            return new ArrayList<>();
        } else {
            return user.getCertifications();
        }
    }

    @Override
    public void deleteCertification(Image certification) throws CertificationNotFoundException, UsernameNotFoundException, NoCertificationsAddedException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getCertifications() == null || user.getCertifications().isEmpty()) {
            user.setCertifications(new ArrayList<>());
            throw new NoCertificationsAddedException("There are no certifications added yet.");
//            return new ArrayList<>();
        } else if (user.getCertifications().contains(certification)) {
            user.getCertifications().remove(certification);
        } else {
            throw new CertificationNotFoundException("Certification: '" + certification + "' not found!");
        }
    }

    @Override
    public void deleteAllCertifications() throws UsernameNotFoundException, NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());

        if (user.getRoles().contains(Role.valueOf("REFASHIONER"))) {
            user.setCertifications(new ArrayList<>());
        }
        throw new NoAccessRightsException("You do not have the access rights to do this method!");
    }

//    @Override
//    public void approveCertification(Image image) throws NoAccessRightsException {
//        AppUser user = appUserService.getUser(userService.getCurrentUsername());
//
//        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
//
//        }
//    }
//
//    @Override
//    public void rejectCertification(Long certificationId) throws NoAccessRightsException {
//
//    }

    @Override
    public String getRefashionerDesc() throws UsernameNotFoundException, RefashionerDescEmptyException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRefashionerDesc() == null || user.getRefashionerDesc().isEmpty() || user.getRefashionerDesc().length() == 0) {
            throw new RefashionerDescEmptyException("You have not added a refashioner description yet");
        } else {
            return user.getRefashionerDesc();
        }
    }

    @Override
    public String addRefashionerDesc(String desc) throws UsernameNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        user.setRefashionerDesc(desc);
        return desc;
    }

    @Override
    public void clearRefashionerDesc() throws UsernameNotFoundException, RefashionerDescEmptyException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRefashionerDesc().isEmpty() || user.getRefashionerDesc().length() == 0) {
            throw new RefashionerDescEmptyException("You have not added a refashioner description yet");
        } else {
            user.setRefashionerDesc("");
        }
    }

    @Override
    public String updateRefashionerDesc(String desc) throws UsernameNotFoundException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        user.setRefashionerDesc(desc);
        appUserRepo.save(user);
        return desc;
    }

    @Override
    public void favouriteRefashioner(Long id) throws RefashionerNotFoundException, RefashionerAlreadyFavouritedException, NotARefashionerException {
        AppUser userToFavourite = appUserService.getUserById(id);

        if (userToFavourite.getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
            if (loggedInUser.getRefashionerFavourites().contains(userToFavourite)) {
                throw new RefashionerAlreadyFavouritedException("Refashioner with id: " + id + " already exists in your favourites!");
            } else {
                loggedInUser.getRefashionerFavourites().add(userToFavourite);
                appUserRepo.save(loggedInUser);
            }
        } else {
            throw new NotARefashionerException("User with id: " + id + " is not a refashioner!");
        }
    }

//        Optional<AppUser> userToFavourite = appUserRepo.findById(id);
//        if (userToFavourite.isEmpty()) {
//            throw new UserDoesNotExistException("User with id: " + id + " cannot be found.");
//        } else {
//            AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
//
//            if (userToFavourite.get().getRoles().contains(Role.valueOf("USER_REFASHIONER"))) {
//                List<AppUser> favouriteRefashioners = loggedInUser.getRefashionerFavourites();
//                if (favouriteRefashioners.contains(userToFavourite.get())) {
//                    throw new RefashionerAlreadyFavouritedException("This refashioner with the id: " + id + " already exists in your favourites.");
//                } else {
//                    favouriteRefashioners.add(userToFavourite.get());
//                    loggedInUser.setRefashionerFavourites(favouriteRefashioners);
//                    appUserRepo.save(loggedInUser);
//                }
//            } else {
//                throw new NotARefashionerException("This user with the id: " + id + " is not a refashioner.");
//            }
//        }
//    }

    @Override
    public void unfavouriteRefashioner(Long id) throws UserDoesNotExistException, FavouriteNotFoundException {
        Optional<AppUser> user = appUserRepo.findById(id);
        if (user.isEmpty()) {
            throw new UserDoesNotExistException(("User with id: " + id + " cannot be found."));
        } else {
            AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
            List<AppUser> favouriteRefashioners = appUser.getRefashionerFavourites();
            if (favouriteRefashioners.contains(user.get())) {
                favouriteRefashioners.remove(user.get());
                appUser.setRefashionerFavourites(favouriteRefashioners);
                appUserRepo.save(appUser);
            } else {
                throw new FavouriteNotFoundException("This refashioner with the id: " + id + " does not exist in your favourites.");
            }
        }
    }

    @Override
    public List<AppUser> retrieveFavouritedRefashioners() {
        AppUser appUser = appUserService.getUser(userService.getCurrentUsername());
        List<AppUser> favouriteRefashioners = appUser.getRefashionerFavourites();
        return favouriteRefashioners;
    }

    @Override
    public Double retrieveRatingForUserById(Long userId) throws UserDoesNotExistException {
        AppUser user = appUserService.getUserById(userId);
//        if (user.getRating() == null) {
//            user.setRating(5.0);
//            return user.getRating();
//        }
        return user.getRating();
    }

    @Override
    public Double retrieveRatingForUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserService.getUser(username);
//        if (user.getRating() == null) {
//            user.setRating(5.0);
//            return user.getRating();
//        }
        return user.getRating();
    }

    @Override
    public Integer retrieveNumberOfCompletedProjects(Long userId) throws UserDoesNotExistException {
        AppUser user = appUserService.getUserById(userId);
        //Get all the completed projects that the refashioner has
        List<Order2> completedProjects = order2Service.retrieveAllCompletedOrdersForPRandPL();
        return completedProjects.size();
    }
}
