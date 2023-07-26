package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.Experience;
import com.altnative.Alt.Native.Model.Image;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RefashionerService {
    Experience addExpertise(Experience expertise) throws ExpertiseExistsAlreadyException, UsernameNotFoundException;

    String addApprovedCertification(String certification, Long refashionerId) throws ApprovedCertificationExistsAlreadyException, UsernameNotFoundException, NoAccessRightsException;

    List<String> retrieveApprovedCertifications() throws NoApprovedCertificationsAddedException, UsernameNotFoundException;

    void deleteApprovedCertification(String certification) throws ApprovedCertificationNotFoundException, UsernameNotFoundException, NoApprovedCertificationsAddedException;

    List<AppUser> retrieveRefashionersOfProjectRequest(Long id) throws ProjectRequestNotFoundException, OfferNotFoundException;

    // String retrieveCertificationById(Long certificationId) throws CertificationNotFoundException;

    void deleteAllApprovedCertifications() throws UsernameNotFoundException, NoAccessRightsException;

    //Image addCertification(Image certification) throws UsernameNotFoundException, NoAccessRightsException;

    void addCertification(MultipartFile file) throws UsernameNotFoundException, NoAccessRightsException, InvalidFileException, S3Exception;

    List<Image> retrieveCertifications() throws NoCertificationsAddedException, UsernameNotFoundException;

    void deleteCertification(Image certification) throws
            CertificationNotFoundException, UsernameNotFoundException, NoCertificationsAddedException;

    void deleteAllCertifications() throws UsernameNotFoundException, NoAccessRightsException;

//    void approveCertification(Long certificationId, String certification) throws NoAccessRightsException;
//
//    void rejectCertification(Long certificationId) throws NoAccessRightsException;

    List<Experience> retrieveExpertises() throws NoExpertiseAddedException, UsernameNotFoundException;

    void deleteExpertise(String expertise) throws
            ExpertiseNotFoundException, UsernameNotFoundException, NoExpertiseAddedException;

    void deleteAllExpertise() throws UsernameNotFoundException;

    String getRefashionerDesc() throws UsernameNotFoundException, RefashionerDescEmptyException;

    String addRefashionerDesc(String desc) throws UsernameNotFoundException;

    void clearRefashionerDesc() throws UsernameNotFoundException, RefashionerDescEmptyException;

    String updateRefashionerDesc(String desc) throws UsernameNotFoundException;

    List<AppUser> getRefashionersByCategories(List<Long> cIds) throws RefashionerNotFoundException;

    List<AppUser> getRefashionersByKeyword(String keyword) throws RefashionerNotFoundException;

    void favouriteRefashioner(Long id) throws
            RefashionerNotFoundException, RefashionerAlreadyFavouritedException, NotARefashionerException;

    void unfavouriteRefashioner(Long id) throws UserDoesNotExistException, FavouriteNotFoundException;

    List<AppUser> retrieveFavouritedRefashioners();

    Double retrieveRatingForUserById(Long userId) throws UserDoesNotExistException;

    Double retrieveRatingForUserByUsername(String username) throws UsernameNotFoundException;

    Integer retrieveNumberOfCompletedProjects(Long userId) throws UserDoesNotExistException;
}
