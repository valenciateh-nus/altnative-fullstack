package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.CategoryNotFoundException;
import com.altnative.Alt.Native.Exceptions.ExperienceNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Model.Experience;
import com.altnative.Alt.Native.Service.ExperienceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ExperienceController {
    private final ExperienceService expertiseService;

    @PostMapping("/experiences")
    public ResponseEntity<?> createListOfExperiences(@Valid @RequestBody List<Experience> experiences) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/experiences/createListOfExperiences").toUriString());
        return ResponseEntity.created(uri).body(expertiseService.createListOfExperiences(experiences));
    }

    @GetMapping("/experiences")
    public ResponseEntity<List<Experience>> retrieveAllExperiences() {
        return ResponseEntity.ok().body(expertiseService.retrieveAllExperiences());
    }

    @GetMapping("/experiences/{userId}")
    public ResponseEntity<List<Experience>> retrieveListOfExperiencesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok().body(expertiseService.retrieveListOfExperiencesByUserId(userId));
    }

    @GetMapping("/expertise/{id}")
    public ResponseEntity<?> retrieveExperienceById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(expertiseService.retrieveExperienceById(id));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/experiences/update")
    public ResponseEntity<?> updateExperience(@Valid @RequestBody Experience experience) {
        try {
            return ResponseEntity.ok().body(expertiseService.updateExperience(experience));
        } catch (ExperienceNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/experiences/updateExperiences")
    public ResponseEntity<?> updateListOfExperiences(@Valid @RequestBody List<Experience> experiences) {
        try {
            return ResponseEntity.ok().body(expertiseService.updateListOfExperiences(experiences));
        } catch (ExperienceNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/expertise/delete/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id) {
        try {
            expertiseService.deleteExperience(id);
            return ResponseEntity.ok().body("Expertise with ID: " + id + " deleted successfully.");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}

