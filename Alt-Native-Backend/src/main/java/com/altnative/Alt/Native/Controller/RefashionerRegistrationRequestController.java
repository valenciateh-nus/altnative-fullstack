package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Milestone;
import com.altnative.Alt.Native.Model.RefashionerRegistrationRequest;
import com.altnative.Alt.Native.Service.RefashionerRegistrationRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class RefashionerRegistrationRequestController {
    private final RefashionerRegistrationRequestService refashionerRegistrationRequestService;

    @PostMapping("/refashionerRegistrationRequest")
    public ResponseEntity<?> createRefashionerRegistrationRequest(@RequestPart RefashionerRegistrationRequest refashionerRegistrationRequest, @RequestPart(value="files", required = false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/refashionerRegistrationRequest").toUriString());
        try {
            return ResponseEntity.created(uri).body(refashionerRegistrationRequestService.createRefashionerRegistrationRequest(refashionerRegistrationRequest, files));
        } catch (RefashionerRegistrationRequestFailedException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashionerRegistrationRequests")
    public ResponseEntity<?> retrieveAllRefashionerRegistrationRequests() throws NoRefashionerRegistrationRequestExistsException {
        try {
            return ResponseEntity.ok().body(refashionerRegistrationRequestService.retrieveAllRefashionerRegistrationRequests());
        } catch (NoRefashionerRegistrationRequestExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashionerRegistrationRequest/{id}")
    public ResponseEntity<?> retrieveRefashionerRegistrationRequestById(@PathVariable Long id) throws RefashionerRegistrationRequestNotFoundException {
        try {
            return ResponseEntity.ok().body(refashionerRegistrationRequestService.retrieveRefashionerRegistrationRequestById(id));
        } catch (RefashionerRegistrationRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashionerRegistrationRequest/update")
    public ResponseEntity<?> RefashionerRegistrationRequest(@RequestBody RefashionerRegistrationRequest refashionerRegistrationRequest) throws RefashionerRegistrationRequestNotFoundException {
        try {
            return ResponseEntity.ok().body(refashionerRegistrationRequestService.updateRefashionerRegistrationRequest(refashionerRegistrationRequest));
        } catch (RefashionerRegistrationRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/refashionerRegistrationRequest/deleteById/{id}")
    public ResponseEntity<?> deleteRefashionerRegistrationRequestById(@PathVariable Long id) throws RefashionerRegistrationRequestNotFoundException {
        try {
            refashionerRegistrationRequestService.deleteRefashionerRegistrationRequestById(id);
            return ResponseEntity.ok().body("Refashioner Registration Request with ID: " + id + " successfully deleted.");
        } catch (RefashionerRegistrationRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashionerRegistrationRequest/user/{id}")
    public ResponseEntity<?> retrieveRefashionerRegistrationRequestsByUserId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(refashionerRegistrationRequestService.retrieveRefashionerRegistrationRequestsByUserId(id));
        } catch (NoRefashionerRegistrationRequestExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/refashionerRegistrationRequest/rejected/user/{id}")
    public ResponseEntity<?> retrieveRejectedRefashionerRegistrationRequestsByUserId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(refashionerRegistrationRequestService.retrieveRejectedRefashionerRegistrationRequestsByUserId(id));
        } catch (NoRefashionerRegistrationRequestExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/refashionerRegistrationRequest/{id}/approve")
    public ResponseEntity<?> approveRefashionerRegistrationRequest(@PathVariable Long id) {
        try {
            refashionerRegistrationRequestService.approveRefashionerRegistrationRequest(id);
            return ResponseEntity.ok().body("You have successfully approved refashioner registration request with id: " + id + ".");
        } catch (RefashionerRegistrationRequestNotFoundException | NoAccessRightsException | RefashionerRegistrationRequestFailedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashionerRegistrationRequestWithCertifications/{id}/approve")
    public ResponseEntity<?> approveRefashionerRegistrationRequestWithCertifications(@PathVariable Long id, @RequestPart List<String> certifiedCertifications) {
        try {
            refashionerRegistrationRequestService.approveRefashionerRegistrationRequestWithCertifications(id, certifiedCertifications);
            return ResponseEntity.ok().body("You have successfully approved refashioner registration request with id: " + id + ".");
        } catch (RefashionerRegistrationRequestNotFoundException | NoAccessRightsException | RefashionerRegistrationRequestFailedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashionerRegistrationRequest/{id}/reject")
    public ResponseEntity<?> rejectRefashionerRegistrationRequest(@PathVariable Long id) {
        try {
            refashionerRegistrationRequestService.rejectRefashionerRegistrationRequest(id);
            return ResponseEntity.ok().body("You have successfully rejected refashioner registration request with id: " + id + ".");
        } catch (RefashionerRegistrationRequestNotFoundException | NoAccessRightsException | RefashionerRegistrationRequestFailedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refashioner/{refashionerId}/addCertification")
    public ResponseEntity<?> addRefashionerCertification(@PathVariable Long refashionerId, @RequestBody String certification) {
        try {
            refashionerRegistrationRequestService.addRefashionerCertification(refashionerId, certification);
            return ResponseEntity.ok().body("You have successfully added the certification for refashioner with id: " + refashionerId + ".");
        } catch (NoAccessRightsException | NotARefashionerException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/newRefashioners")
    public ResponseEntity<?> retrieveNoOfNewRefashioners(@RequestBody DateDto dates) {
        return ResponseEntity.ok().body(refashionerRegistrationRequestService.retrieveNoOfNewRefashioners(dates));
    }
}
