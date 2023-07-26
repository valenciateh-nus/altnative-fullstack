package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.ProjectListing;
import com.altnative.Alt.Native.Service.ProjectListingService;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ProjectListingController {
    private final ProjectListingService projectListingService;

    @PostMapping("/categories/{cId}/projectListings")
    public ResponseEntity<?> createProjectListing(@PathVariable Long cId, @Valid @RequestPart ProjectListing projectListing, @RequestPart(value="files") List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/categories/{cId}/projectListing").toUriString());
        try {
            return ResponseEntity.ok().body(projectListingService.createProjectListing(cId, projectListing, files));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/projectListing/{projectListingId}")
    public ResponseEntity<?> addImageToProjectListing(@PathVariable Long projectListingId, @RequestPart(value="file", required=true) MultipartFile file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectListing/{projectListingId}").toUriString());
        try {
            projectListingService.addImageToProjectListing(projectListingId, file);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/projectListing/{projectListingId}/image/{imageId}")
    public ResponseEntity<?> removeImageFromProjectListing(@PathVariable Long projectListingId, @PathVariable Long imageId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectListing/{projectListingId}/image/{imageId}").toUriString());
        try {
            projectListingService.removeImageFromProjectListing(projectListingId, imageId);
            return ResponseEntity.ok().build();
        } catch (NoAccessRightsException | ProjectListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // search available project listings for use case "I'm looking for..."
    // search by selection of categories AND/OR input keyword for ONLY material/title/cat name
    // if no search query given, retrieve all PLs
    @GetMapping("/projectListings/search")
    public ResponseEntity<?> searchProjectListings(@RequestParam Optional<Long[]> cIds,
                                                   @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (cIds.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(projectListingService.retrieveAvailableProjectListings());
            } else {
                response = ResponseEntity.ok().body(projectListingService.searchProjectListings(cIds, keyword));
            }
        } catch (ProjectListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    // admin
    @GetMapping("/allProjectListings/search")
    public ResponseEntity<?> searchAllProjectListings(@RequestParam Optional<Long[]> cIds,
                                                   @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (cIds.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(projectListingService.retrieveAllProjectListings());
            } else {
                response = ResponseEntity.ok().body(projectListingService.searchAllProjectListings(cIds, keyword));
            }
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    // search project listings only under logged in user
    // search by selection of categories OR input keyword for all material/title/tag/cat name
    // if no search query given, retrieve all own PLs
    @GetMapping("/myProjectListings/search")
    public ResponseEntity<?> searchOwnProjectListings(@RequestParam Optional<Long[]> cIds,
                                                   @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (cIds.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(projectListingService.retrieveOwnProjectListings());
            } else {
                response = ResponseEntity.ok().body(projectListingService.searchOwnProjectListings(cIds, keyword));
            }
        } catch (ProjectListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    // search project listings for use case "Refashion ideas for..."
    // search by selection of categories AND/OR input keyword for ONLY tag/title/cat name
    // if no search query given, retrieve all PLs
    @GetMapping("/projectListings/search2")
    public ResponseEntity<?> searchProjectListings2(@RequestParam Optional<Long[]> cIds,
                                                    @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        try {
            if (cIds.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(projectListingService.retrieveAvailableProjectListings());
            } else {
                response = ResponseEntity.ok().body(projectListingService.searchProjectListings2(cIds, keyword));
            }
        } catch (ProjectListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    @GetMapping("/projectListings")
    public ResponseEntity<?> retrieveAllProjectListings() {
        try {
            return ResponseEntity.ok().body(projectListingService.retrieveAllProjectListings());
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/projectListing/{id}")
    public ResponseEntity<?> retrieveProjectListingById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(projectListingService.retrieveProjectListingById(id));
        } catch (ProjectListingNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/projectListing/refashioner/{refashionerId}")
    public ResponseEntity<?> retrieveProjectListingsByRefashionerId(@PathVariable Long refashionerId) {
        try {
            return ResponseEntity.ok().body(projectListingService.retrieveProjectListingsByRefashionerId(refashionerId));
        } catch (ProjectListingNotFoundException | NotARefashionerException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }


    @PutMapping("/projectListing")
    public ResponseEntity<?> updateProjectListing(@Valid @RequestBody ProjectListing projectListing) {
        try {
            return ResponseEntity.ok().body(projectListingService.updateProjectListing(projectListing));
        } catch (ProjectListingNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/projectListing/delete/{id}")
    public ResponseEntity<?> deleteProjectListingById(@PathVariable Long id) {
        try {
            projectListingService.deleteProjectListing(id);
            return ResponseEntity.ok().body("Project Listing with ID: " + id + " deleted successfully.");
        } catch (ProjectListingNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/projectListing/favourite/{id}")
    public ResponseEntity<?> favouriteProjectListingById(@PathVariable Long id) throws ProjectListingNotFoundException, ProjectListingAlreadyFavouritedException {
        try {
            projectListingService.favouriteProjectListing(id);
            return ResponseEntity.ok().body("Project listing with id: " + id + " favourited successfully");
        } catch (ProjectListingNotFoundException | ProjectListingAlreadyFavouritedException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/projectListing/unfavourite/{id}")
    public ResponseEntity<?> unfavouriteProjectListingById(@PathVariable Long id) throws ProjectListingNotFoundException, FavouriteNotFoundException {
        try {
            projectListingService.unfavouriteProjectListing(id);
            return ResponseEntity.ok().body("Project listing with id: " + id + " unfavourited successfully");
        } catch (ProjectListingNotFoundException | FavouriteNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/projectListing/favourites")
    public ResponseEntity<?> retrieveFavouritedProjectListings() {
        return ResponseEntity.ok().body(projectListingService.retrieveFavouritedProjectListings());
    }

    // users search for other refashioners' pls
    @GetMapping("/projectListings/username/{username}")
    public ResponseEntity<?> retrieveProjectListingsByUsername(@PathVariable String username,
                                                               @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        if (keyword.isEmpty()) {
            response = ResponseEntity.ok().body(projectListingService.retrieveProjectListingsByUsername(username));
        } else {
            response = ResponseEntity.ok().body(projectListingService.searchProjectListingsByUser(username, keyword));
        }
        return response;
    }
}
