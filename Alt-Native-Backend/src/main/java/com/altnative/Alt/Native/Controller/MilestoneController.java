package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Milestone;
import com.altnative.Alt.Native.Service.MilestoneService;
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
public class MilestoneController {
    private final MilestoneService milestoneService;

    @PostMapping("/orders/{orderId}/createMilestone")
    public ResponseEntity<?> createMilestone(@RequestPart(value="files",required=false) List<MultipartFile> files, @RequestPart Milestone milestone, @PathVariable Long orderId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/orders/{orderId}/createMilestone").toUriString());
        try {
            return ResponseEntity.ok().body(milestoneService.createMilestone(files, milestone, orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/orders/{orderId}/milestones")
    public ResponseEntity<?> retrieveMilestonesForOrder(@PathVariable Long orderId, @RequestParam Optional<String> token) {
        try {
            return ResponseEntity.ok().body(milestoneService.retrieveMilestonesForOrder(orderId, token));
        } catch (OrderNotFoundException | NoMilestoneExistsException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/milestone/{id}")
    public ResponseEntity<?> retrieveMilestoneById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(milestoneService.retrieveMilestoneById(id));
        } catch (MilestoneNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/milestone/deleteById/{id}")
    public ResponseEntity<?> deleteMilestoneById(@PathVariable Long id) {
        try {
            milestoneService.deleteMilestoneById(id);
            return ResponseEntity.ok().body("Milestone with ID: " + id + " deleted successfully.");
        } catch (MilestoneNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
    @PutMapping("/milestone/update")
    public ResponseEntity<?> updateMilestone(@RequestBody Milestone milestone) {
        try {
            return ResponseEntity.ok().body(milestoneService.updateMilestone(milestone));
        } catch (MilestoneNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

//    @PostMapping("/orders/{orderId}/addMilestone")
//    public ResponseEntity<?> createMilestone(@RequestBody Milestone milestone, @PathVariable Long orderId) {
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/orders/{orderId}/addMilestone").toUriString());
//        try {
//            return ResponseEntity.created(uri).body(milestoneService.createMilestone(milestone, orderId));
//        } catch (OrderNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
}
