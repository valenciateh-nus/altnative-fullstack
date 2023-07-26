package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.ExperienceNotFoundException;
import com.altnative.Alt.Native.Exceptions.ProjectRequestNotFoundException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.Experience;
import com.altnative.Alt.Native.Model.ProjectRequest;
import com.altnative.Alt.Native.Model.User;
import com.altnative.Alt.Native.Repository.AppUserRepo;
import com.altnative.Alt.Native.Repository.ExperienceRepo;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ExperienceServiceImpl implements ExperienceService {
    private final ExperienceRepo expRepo;
    private final UserService userService;
    private final AppUserService appUserService;
    private final AppUserRepo appUserRepo;

    @Override
    public List<Experience> createListOfExperiences(List<Experience> experiences) {
        AppUser loggedInUser = appUserService.getUser(userService.getCurrentUsername());
        List<Experience> userExperiences = loggedInUser.getExpertises();

        if (experiences.size() > 0) { //not empty
            for (Experience exp : experiences) {
                exp.setName(exp.getName());
                exp.setExperienceLevel(exp.getExperienceLevel());
                exp.setRefashioner(loggedInUser);
                expRepo.save(exp);
                userExperiences.add(exp);
            }
        }
        loggedInUser.setExpertises(userExperiences); //Add first, if they are rejected as a refashioner then empty the list
        return experiences;
    }

    @Override
    public Experience retrieveExperienceById(Long id) throws ExperienceNotFoundException, NoAccessRightsException {
        Optional<Experience> exists = expRepo.findById(id);
        if (exists.isEmpty()) {
            throw new ExperienceNotFoundException("Experience id: " + id + " does not exist.");
        } else {
            Experience exp = exists.get();
            return exp;
        }
    }

    @Override
    public List<Experience> retrieveAllExperiences() {
        return expRepo.findAll();
    }

    @Override
    public Experience updateExperience(Experience newExperience) throws ExperienceNotFoundException, NoAccessRightsException {
        //Only admin and refashioner can update experience
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        log.info("Current user is ", currUser);
        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.equals(newExperience.getRefashioner())) {
            Optional<Experience> expOpt = expRepo.findById(newExperience.getId());
            if (expOpt.isEmpty()) {
                throw new ExperienceNotFoundException("Experience with id: " + newExperience.getId() + " not found!");
            } else {
                Experience exp = expOpt.get();
                exp.setName(exp.getName()); //cannot modify
                exp.setExperienceLevel(newExperience.getExperienceLevel());
                exp.setRefashioner(currUser);
                expRepo.save(exp);
                return exp;
            }
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public List<Experience> updateListOfExperiences(List<Experience> newExperiences) throws ExperienceNotFoundException, NoAccessRightsException {
        //Only admin and refashioner can update experience
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        //log.info("Current user is ", currUser.getUsername());
//        List<Experience> oldExp = currUser.getExpertises();
//        expRepo.deleteAll(oldExp);
        currUser.setExpertises(new ArrayList<>());
        for (Experience newExperience: newExperiences) {
            newExperience.setId(null);
            newExperience.setRefashioner(currUser);
            expRepo.save(newExperience);
            currUser.getExpertises().add(newExperience);

        }
        expRepo.flush();
        return newExperiences;
    }

    @Override
    public void deleteExperience(Long id) throws ExperienceNotFoundException, NoAccessRightsException {
        Optional<Experience> exists = expRepo.findById(id);
        if (exists.isEmpty()) {
            throw new ExperienceNotFoundException("Experience id: " + id + " does not exist.");
        } else {
            Experience exp = exists.get();
            log.info(exp.getName());
            AppUser expOwner = exp.getRefashioner();
            log.info(exp.getRefashioner().getUsername());
            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
            log.info("Curr user" + currUser.getUsername());
            if (expOwner.getId() == currUser.getId() || expOwner.getId().equals(currUser.getId()) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                log.info("Entering loop");
                expOwner.getExpertises().remove(exp);
                expRepo.delete(exp);
            } else {
                throw new NoAccessRightsException("You do not have access to this method!");
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//        Optional<Experience> exp = expRepo.findById(id);
//        if (exp.isEmpty()) {
//            throw new ExperienceNotFoundException("Experience with id: " + id + " not found!");
//        } else {
//            Experience expToDelete = exp.get();
//            log.info("Current experience is " + expToDelete);
//            //Only admin or refashioner can delete the experience
////            AppUser expOwner = expToDelete.getRefashioner();
////            if (expOwner.getId() == currUser.getId() || expOwner.getId().equals(currUser.getId()) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
////                log.info("Entering this");
////                //expOwner.getExpertises().remove(expToDelete);
////                //expRepo.delete(expToDelete);
////            } else {
////                throw new NoAccessRightsException("You do not have access to this method!");
            }
        }
    }

    public List<Experience> retrieveListOfExperiencesByUserId(Long id) throws UserDoesNotExistException {
        AppUser appUser = (AppUser) appUserRepo.findById(id).orElseThrow(
                () -> new UserDoesNotExistException("User id: " + id + " does not exist."));
        List<Experience> exists = appUser.getExpertises();
        return exists;
    }
}


