package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Enum.FollowUpStatus;
import com.altnative.Alt.Native.Enum.SwapRequestStatus;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Model.MarketplaceListing;
import com.altnative.Alt.Native.Model.SwapRequest;
import com.altnative.Alt.Native.Service.SwapRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

    @PostMapping("/swapRequest/category/{categoryId}")
    public ResponseEntity<?> createSwapRequest(@RequestPart SwapRequest swapRequest, @PathVariable Long categoryId, @RequestPart(value = "files", required = true) List<MultipartFile> imageList) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/swapRequest").toUriString());
        try {
            return ResponseEntity.created(uri).body(swapRequestService.createSwapRequest(swapRequest.getItemName(), swapRequest.getItemDescription(), categoryId, imageList, swapRequest.getItemCondition()));
        } catch (InvalidFileException | S3Exception | ImageCannotBeEmptyException | CategoryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapRequest/{swapRequestId}")
    public ResponseEntity<?> updateTrackingNumberForSwapRequest(@PathVariable Long swapRequestId, @RequestBody String trackingNumber) {
        try {
            return ResponseEntity.ok().body(swapRequestService.updateTrackingNumberForSwapRequest(swapRequestId, trackingNumber));
        } catch (NoAccessRightsException | SwapRequestNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapRequest/{swapRequestId}/status")
    public ResponseEntity<?> updateStatusForSwapRequest(@PathVariable Long swapRequestId, @RequestBody SwapRequestStatus swapRequestStatus) {
        try {
            return ResponseEntity.ok().body(swapRequestService.updateStatusForSwapRequest(swapRequestId, swapRequestStatus));
        } catch (SwapRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/swapRequest/{swapRequestId}")
    public ResponseEntity<?> retrieveSwapRequestById(@PathVariable Long swapRequestId) {
        try {
            return ResponseEntity.ok().body(swapRequestService.retrieveSwapRequestById(swapRequestId));
        } catch (SwapRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/swapRequests")
    public ResponseEntity<?> retrieveListOfSwapRequests() {
        try {
            return ResponseEntity.ok().body(swapRequestService.retrieveListOfSwapRequests());
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapRequest/{swapRequestId}/approved/credits/{creditsAwarded}")
    public ResponseEntity<?> approveSwapRequest(@PathVariable Long swapRequestId, @PathVariable Integer creditsAwarded) {
        try {
            return ResponseEntity.ok().body(swapRequestService.approveSwapRequest(swapRequestId, creditsAwarded));
        } catch (NoAccessRightsException | SwapRequestNotFoundException | SwapRequestAlreadyCreditedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapRequest/{swapRequestId}/rejected/credits/{creditsAwarded}")
    public ResponseEntity<?> rejectSwapRequestWithCredits(@PathVariable Long swapRequestId, @RequestParam String remarks, @PathVariable Integer creditsAwarded) {
        try {
            return ResponseEntity.ok().body(swapRequestService.rejectSwapRequestWithCredits(swapRequestId, remarks, creditsAwarded));
        } catch (NoAccessRightsException | SwapRequestNotFoundException | SwapRequestAlreadyCreditedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapRequest/{swapRequestId}/rejected")
    public ResponseEntity<?> rejectSwapRequest(@PathVariable Long swapRequestId, @RequestParam String remarks) {
        try {
            return ResponseEntity.ok().body(swapRequestService.rejectSwapRequest(swapRequestId, remarks));
        } catch (NoAccessRightsException | SwapRequestNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/swapRequest/{swapRequestId}")
    public ResponseEntity<?> deleteSwapRequest(@PathVariable Long swapRequestId) {
        try {
            swapRequestService.deleteSwapRequest(swapRequestId);
            return ResponseEntity.ok().body("Marketplace listing with id: " + swapRequestId + " deleted successfully");
        } catch (NoAccessRightsException | SwapRequestNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/ownSwapRequests")
    public ResponseEntity<?> retrieveOwnSwapRequests() {
        return ResponseEntity.ok().body(swapRequestService.retrieveOwnSwapRequests());
    }

    @PostMapping("/swapRequest/{swapRequestId}/followUp")
    public ResponseEntity<?> followUpRejectedItem(@PathVariable Long swapRequestId, @RequestBody FollowUpStatus followUpStatus) {
        try {
            return ResponseEntity.ok().body(swapRequestService.followUpRejectedItem(swapRequestId, followUpStatus));
        } catch (NoAccessRightsException | SwapRequestNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapRequest/{swapRequestId}/complete")
    public ResponseEntity<?> updateFollowUpStatusToComplete(@PathVariable Long swapRequestId) {
        try {
            return ResponseEntity.ok().body(swapRequestService.updateFollowUpStatusToComplete(swapRequestId));
        } catch (NoAccessRightsException | SwapRequestNotFoundException | SwapRequestAlreadyCompletedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

}
