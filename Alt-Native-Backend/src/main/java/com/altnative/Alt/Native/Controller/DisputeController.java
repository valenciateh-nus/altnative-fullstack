package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Dispute;
import com.altnative.Alt.Native.Service.DisputeService;
import com.stripe.model.Refund;
import com.stripe.model.SetupIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class DisputeController {
    private final DisputeService disputeService;

    @PostMapping("/orders/{orderId}/disputes")
    public ResponseEntity<?> createDispute(@PathVariable Long orderId, @RequestPart Dispute dispute, @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/orders/{orderId}/disputes").toUriString());
        try {
            return ResponseEntity.ok().body(disputeService.createDispute(orderId, dispute, files));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // admin filters disputes that are either REJECTED or ACCEPTED but refund failed
    @GetMapping("/pendingDisputes")
    public ResponseEntity<?> searchPendingDisputes(@RequestParam Optional<String[]> statuses) {
        ResponseEntity<?> response = null;
        try {
            if (statuses.isEmpty()) {
                response = ResponseEntity.ok().body(disputeService.retrievePendingReviewDisputes());
            } else {
                response = ResponseEntity.ok().body(disputeService.filterDisputesByStatus(statuses));
            }
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    @GetMapping("/orders/{orderId}/disputes")
    public ResponseEntity<?> retrieveDisputesForOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(disputeService.retrieveDisputesOfOrder(orderId));
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/disputes/{id}")
    public ResponseEntity<?> retrieveDisputeByDisputeId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(disputeService.retrieveDisputeByDisputeId(id));
        } catch (DisputeNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/disputes/user/{id}")
    public ResponseEntity<?> retrieveListOfDisputesByUserId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(disputeService.retrieveListOfDisputesByUserId(id));
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/disputes")
    public ResponseEntity<?> retrieveAllDisputes() {
        try {
            return ResponseEntity.ok().body(disputeService.retrieveListOfDisputes());
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/dispute/{id}")
    public ResponseEntity<?> deleteDisputeById(@PathVariable Long id) {
        try {
            disputeService.deleteDispute(id);
            return ResponseEntity.ok().body("Dispute with ID: " + id + " deleted successfully.");
        } catch (DisputeNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }


    @PostMapping("/disputes/{disputeId}")
    public ResponseEntity<?> addImageToDispute(@PathVariable Long disputeId, @RequestPart(value = "file", required = true) MultipartFile file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/disputes/{disputeId}").toUriString());
        try {
            disputeService.addImageToDispute(disputeId, file);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/disputes/{disputeId}/images/{imageId}")
    public ResponseEntity<?> removeImageFromDispute(@PathVariable Long disputeId, @PathVariable Long imageId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/disputes/{disputeId}/images/{imageId}").toUriString());
        try {
            disputeService.removeImageFromDispute(disputeId, imageId);
            return ResponseEntity.ok().build();
        } catch (NoAccessRightsException | DisputeNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/disputes/update")
    public ResponseEntity<?> editDispute(@RequestBody Dispute dispute) {
        try {
            return ResponseEntity.ok().body(disputeService.editDispute(dispute));
        } catch (DisputeNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/disputes/{disputeId}/accept")
    public ResponseEntity<?> acceptDispute(@PathVariable Long disputeId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/disputes/{disputeId}/accept").toUriString());
        try {
            return ResponseEntity.ok().body(disputeService.acceptDispute(disputeId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/disputes/{disputeId}/reject")
    public ResponseEntity<?> rejectDispute(@PathVariable Long disputeId, @RequestParam String rejectRemarks) {
        try {
            return ResponseEntity.ok().body(disputeService.rejectDispute(disputeId, rejectRemarks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/disputes/{disputeId}/end")
    public ResponseEntity<?> endDispute(@PathVariable Long disputeId, @RequestBody String adminRemarks) {
        try {
            return ResponseEntity.ok().body(disputeService.endDispute(disputeId, adminRemarks));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refunds")
    public ResponseEntity<?> retrieveRefunds(@RequestBody DateDto dates) {
        return ResponseEntity.ok().body(disputeService.retrieveRefundsByDate(dates));
    }
}