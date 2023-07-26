package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Experience;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Model.User;
import com.altnative.Alt.Native.Service.RefashionerService;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class RefashionerController {

    private final RefashionerService refashionerService;

    @GetMapping("/refashioners/{cIds}")
    public ResponseEntity<?> getRefashionersByCategories(@PathVariable List<Long> cIds) {
        try {
            return ResponseEntity.ok().body(refashionerService.getRefashionersByCategories(cIds));
        } catch (RefashionerNotFoundException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/refashioners/keyword/{keyword}")
    public ResponseEntity<?> getRefashionersByKeyword(@PathVariable String keyword) {
        try {
            return ResponseEntity.ok().body(refashionerService.getRefashionersByKeyword(keyword));
        } catch (RefashionerNotFoundException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/projectRequests/{id}/refashioners")
    public ResponseEntity<?> getRefashionersByKeyword(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(refashionerService.retrieveRefashionersOfProjectRequest(id));
        } catch (OfferNotFoundException | ProjectRequestNotFoundException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/addExpertise")
    public ResponseEntity<?> addExpertise(@RequestBody Experience expertise) {
        try {
            return ResponseEntity.ok().body(refashionerService.addExpertise(expertise));
        } catch (ExpertiseExistsAlreadyException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashioner/expertises")
    public ResponseEntity<?> retrieveExpertises() {
        try {
            return ResponseEntity.ok().body(refashionerService.retrieveExpertises());
        } catch (NoExpertiseAddedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/deleteExpertise")
    public ResponseEntity<?> deleteExpertise(@RequestBody String expertise) {
        try {
            refashionerService.deleteExpertise(expertise);
            return ResponseEntity.ok().body("Expertise: '" + expertise + "' deleted successfully!");
        } catch (ExpertiseNotFoundException | NoExpertiseAddedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/deleteAllExpertise")
    public ResponseEntity<?> deleteAllExpertise() {
        refashionerService.deleteAllExpertise();
        return ResponseEntity.ok().body("All expertises cleared successfully");
    }

    @PostMapping("/refashioner/{id}/addApprovedCertification")
    public ResponseEntity<?> addApprovedCertification(@RequestBody String certification, @PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(refashionerService.addApprovedCertification(certification, id));
        } catch (ApprovedCertificationExistsAlreadyException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashioner/approvedCertifications")
    public ResponseEntity<?> retrieveApprovedCertifications() {
        try {
            return ResponseEntity.ok().body(refashionerService.retrieveApprovedCertifications());
        } catch (NoApprovedCertificationsAddedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/deleteApprovedCertification")
    public ResponseEntity<?> deleteApprovedCertification(@RequestBody String certification) {
        try {
            refashionerService.deleteApprovedCertification(certification);
            return ResponseEntity.ok().body("Certification: '" + certification + "' deleted successfully!");
        } catch (NoApprovedCertificationsAddedException | ApprovedCertificationNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/deleteAllApprovedCertifications")
    public ResponseEntity<?> deleteAllApprovedCertification() {
        try {
            refashionerService.deleteAllApprovedCertifications();
            return ResponseEntity.ok().body("All certifications cleared successfully");
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/addCertification")
    public ResponseEntity<?> addCertification(@RequestPart(value="file", required=true) MultipartFile file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/refashioner/addCertification").toUriString());
        try {
            refashionerService.addCertification(file);
            return ResponseEntity.ok().body("Uploaded certification successfully");
        } catch (NoAccessRightsException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashioner/certifications")
    public ResponseEntity<?> retrieveCertifications() {
        try {
            return ResponseEntity.ok().body(refashionerService.retrieveCertifications());
        } catch (NoCertificationsAddedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/deleteCertification")
    public ResponseEntity<?> deleteCertification(@RequestParam("certification") MultipartFile certification) {
        try {
            refashionerService.deleteCertification((Image) certification);
            return ResponseEntity.ok().body("Certification: '" + certification + "' deleted successfully!");
        } catch (CertificationNotFoundException | NoCertificationsAddedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/deleteAllCertifications")
    public ResponseEntity<?> deleteAllCertifications() {
        try {
            refashionerService.deleteAllCertifications();
            return ResponseEntity.ok().body("All certifications cleared successfully");
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashioner/refashionerDesc")
    public ResponseEntity<?> retrieveRefashionerDesc() {
        try {
            return ResponseEntity.ok().body(refashionerService.getRefashionerDesc());
        } catch (RefashionerDescEmptyException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/addRefashionerDesc")
    public ResponseEntity<?> addRefashionerDesc(@RequestBody String refashionerDesc) {
        return ResponseEntity.ok().body(refashionerService.addRefashionerDesc(refashionerDesc));
    }

    @PostMapping("/refashioner/clearRefashionerDesc")
    public ResponseEntity<?> clearRefashionerDesc() {
        try {
            refashionerService.clearRefashionerDesc();
            return ResponseEntity.ok().body("Refashioner description cleared successfully!");
        } catch (RefashionerDescEmptyException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/updateRefashionerDesc")
    public ResponseEntity<?> updateRefashionerDesc(@RequestBody String refashionerDesc) {
        return ResponseEntity.ok().body(refashionerService.updateRefashionerDesc(refashionerDesc));
    }

    //TO TEST:
    @PostMapping("/refashioner/favourite/{id}")
    public ResponseEntity<?> favouriteRefashionerById(@PathVariable Long id) throws RefashionerNotFoundException, RefashionerAlreadyFavouritedException, NotARefashionerException {
        try {
            refashionerService.favouriteRefashioner(id);
            return ResponseEntity.ok().body("Refashioner with id: " + id + " favourited successfully");
        } catch (RefashionerNotFoundException | RefashionerAlreadyFavouritedException | NotARefashionerException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    //TO TEST:
    @PostMapping("/refashioner/unfavourite/{id}")
    public ResponseEntity<?> unfavouriteRefashionerById(@PathVariable Long id) throws UserDoesNotExistException, FavouriteNotFoundException {
        try {
            refashionerService.unfavouriteRefashioner(id);
            return ResponseEntity.ok().body("Refashioner with id: " + id + " unfavourited successfully");
        } catch (UserDoesNotExistException | FavouriteNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    //TO TEST:
    @GetMapping("/refashioner/favourites")
    public ResponseEntity<?> retrieveFavouritedRefashioners() {
        return ResponseEntity.ok().body(refashionerService.retrieveFavouritedRefashioners());
    }

    @GetMapping("/refashioner/ratingById")
    public ResponseEntity<?> retrieveRatingByUserId(@RequestParam Long id) {
        try {
            return ResponseEntity.ok().body(refashionerService.retrieveRatingForUserById(id));
        } catch (UserDoesNotExistException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashioner/ratingByUsername")
    public ResponseEntity<?> retrieveRatingByUsername(@RequestParam String username) {
        try {
            return ResponseEntity.ok().body(refashionerService.retrieveRatingForUserByUsername(username));
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashioner/{id}/numberOfCompletedProjects")
    public ResponseEntity<?> retrieveNumberOfCompletedProjects(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(refashionerService.retrieveNumberOfCompletedProjects(id));
        } catch (UserDoesNotExistException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
