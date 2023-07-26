package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Model.ProjectListing;
import com.altnative.Alt.Native.Model.ProjectRequest;
import com.altnative.Alt.Native.Service.ProjectRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ProjectRequestController {

    private final ProjectRequestService projectRequestService;

    // user clicks on Publish
    @PostMapping("/publishProjectRequests")
    public ResponseEntity<?> publishProjectRequest(@RequestParam Optional<Long> pId, @RequestParam Optional<Long> cId, @Valid @RequestPart(value = "projectRequest") ProjectRequest projectRequest, @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/publishProjectRequests").toUriString());
        try {
            // newly created PR
            if (pId.isEmpty()) {
                return ResponseEntity.ok().body(projectRequestService.createProjectRequest(cId.get(), projectRequest, files));
                // PR exists as draft
            } else {
                return ResponseEntity.ok().body(projectRequestService.submitProjectRequestInDraft(pId.get(), projectRequest));
            }

        } catch (CategoryNotFoundException | ProjectRequestNotFoundException | ProjectRequestAlreadySubmittedException | ProjectRequestCannotBeModifiedException | NoAccessRightsException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // user clicks on Save
    @PostMapping("/saveProjectRequests")
    public ResponseEntity<?> saveProjectRequest(@RequestParam Optional<Long> pId, @RequestParam Optional<Long> cId, @Valid @RequestPart ProjectRequest projectRequest, @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/saveProjectRequests").toUriString());
        try {
            // newly created PR
            if (pId.isEmpty()) {
                return ResponseEntity.ok().body(projectRequestService.createProjectRequestAsDraft(cId.get(), projectRequest, files));
                // PR exists as draft
            } else {
                return ResponseEntity.ok().body(projectRequestService.editProjectRequestInDraft(pId.get(), projectRequest));
            }

        } catch (CategoryNotFoundException | ProjectRequestNotFoundException | ProjectRequestCannotBeModifiedException | NoAccessRightsException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/projectRequest/{projectRequestId}")
    public ResponseEntity<?> addImageToProjectRequest(@PathVariable Long projectRequestId, @RequestPart(value = "file", required = true) MultipartFile file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectRequest/{projectRequestId}").toUriString());
        try {
            projectRequestService.addImageToProjectRequest(projectRequestId, file);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/projectRequest/{projectRequestId}/image/{imageId}")
    public ResponseEntity<?> removeImageFromProjectRequest(@PathVariable Long projectRequestId, @PathVariable Long imageId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/projectRequest/{projectRequestId}/image/{imageId}").toUriString());
        try {
            projectRequestService.removeImageFromProjectRequest(projectRequestId, imageId);
            return ResponseEntity.ok().build();
        } catch (NoAccessRightsException | ProjectRequestNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // refashionees searches his own PRs
    // search by selection of statuses AND/OR input keyword for material/title/category name/tag
    // if no search query given, retrieve all own PRs
    @GetMapping("/myProjectRequests/search")
    public ResponseEntity<?> searchOwnProjectRequests(@RequestParam Optional<String[]> statuses,
                                                      @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (statuses.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(projectRequestService.retrieveOwnProjectRequests());
            } else {
                response = ResponseEntity.ok().body(projectRequestService.searchOwnProjectRequests(statuses, keyword));
            }
        } catch (ProjectRequestNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    // users search for other refashionees' prs
    @GetMapping("/projectRequests/username/{username}")
    public ResponseEntity<?> retrieveProjectRequestsByUsername(@PathVariable String username,
                                                               @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        if (keyword.isEmpty()) {
            response = ResponseEntity.ok().body(projectRequestService.retrieveProjectRequestsByUsername(username));
        } else {
            response = ResponseEntity.ok().body(projectRequestService.searchProjectRequestsByUser(username, keyword));
        }
        return response;
    }

    // published PRs & BRs searched by refashionees
    // search by selection of categories id AND/OR input keyword for material/title/category name/tag
    // if no search query given, retrieve all PRs
    @GetMapping("/projectRequests/search")
    public ResponseEntity<?> searchProjectRequests(@RequestParam Optional<Long[]> cIds,
                                                   @RequestParam Optional<String> keyword,
                                                   @RequestParam Optional<Boolean> isBusiness) {
        ResponseEntity<?> response = null;

        try {
            if (cIds.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(projectRequestService.retrieveProjectRequestsByStatus(Arrays.asList(RequestStatus.PUBLISHED), isBusiness));
            } else {
                response = ResponseEntity.ok().body(projectRequestService.searchProjectRequests(cIds, keyword, isBusiness));
            }
        } catch (ProjectRequestNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    @GetMapping("/businessRequests/search")
    public ResponseEntity<?> searchBusinessRequests2(@RequestParam Optional<Long[]> cIds,
                                                     @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        if (cIds.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(projectRequestService.retrieveBusinessRequest(Arrays.asList(RequestStatus.PUBLISHED)));
        } else {
            response = ResponseEntity.ok().body(projectRequestService.searchBusinessRequests(cIds, keyword));
        }
        return response;
    }

    @GetMapping("/allProjectRequests/search")
    public ResponseEntity<?> searchProjectRequests2(@RequestParam Optional<Long[]> cIds,
                                                    @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (cIds.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(projectRequestService.retrieveProjectRequestsByStatus2(Arrays.asList(RequestStatus.PUBLISHED)));
            } else {
                response = ResponseEntity.ok().body(projectRequestService.searchAllProjectRequests(cIds, keyword));
            }
        } catch (ProjectRequestNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    @GetMapping("/allBusinessRequests/search")
    public ResponseEntity<?> searchBusinessRequests(@RequestParam Optional<Long[]> cIds,
                                                    @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        if (cIds.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(projectRequestService.retrieveBusinessRequestsByStatus(Arrays.asList(RequestStatus.PUBLISHED)));
        } else {
            response = ResponseEntity.ok().body(projectRequestService.searchAllBusinessRequests(cIds, keyword));
        }
        return response;
    }

    @GetMapping("/allAvailableBusinessRequests/search")
    public ResponseEntity<?> searchAvailableBusinessRequests(@RequestParam Optional<Long[]> cIds,
                                                             @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;
        if (cIds.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(projectRequestService.retrieveAvailableBusinessRequestsByStatus(Arrays.asList(RequestStatus.PUBLISHED)));
        } else {
            response = ResponseEntity.ok().body(projectRequestService.searchAllAvailableBusinessRequests(cIds, keyword));
        }
        return response;
    }

    @GetMapping("/projectRequests/{id}")
    public ResponseEntity<?> retrieveProjectRequestById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(projectRequestService.retrieveProjectRequestById(id));
        } catch (ProjectRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/myOffers")
    public ResponseEntity<?> retrieveAllOffersToUser() {
        try {
            return ResponseEntity.ok().body(projectRequestService.retrieveAllOffersToUser());
        } catch (ProjectRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // retrieves either the project req or project listing
    @GetMapping("/orders/{id}/project")
    public ResponseEntity<?> retrieveProjectByOrderId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(projectRequestService.retrieveProjectByOrderId(id));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("projectRequests/delete/{id}")
    public ResponseEntity<?> deleteProjectRequestById(@PathVariable Long id) {
        try {
            projectRequestService.deleteProjectRequest(id);
            return ResponseEntity.ok().body("Project Request with ID: " + id + " deleted successfully.");
        } catch (ProjectRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("projectRequests/update/{id}")
    public ResponseEntity<?> updateProjectRequest(@PathVariable Long id, @Valid @RequestBody ProjectRequest projectRequest) {
        try {
            return ResponseEntity.ok().body(projectRequestService.updateProjectRequest(id, projectRequest));
        } catch (ProjectRequestNotFoundException | ProjectRequestCannotBeModifiedException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/projectRequests/refashionee/{username}")
    public ResponseEntity<?> retrieveProjectListingsByRefashioneeUsername(@PathVariable String username) {
        return ResponseEntity.ok().body(projectRequestService.retrieveProjectRequestsByUsername(username));
    }

//    @PutMapping("/projectRequests/submitDraft/draft/{id}")
//    public ResponseEntity<?> submitProjectRequestInDraft(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(projectRequestService.submitProjectRequestInDraft(id));
//        } catch (ProjectRequestNotFoundException | ProjectRequestAlreadySubmittedException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    //    @PutMapping("/projectRequests/saveDraft/{id}")
//    public ResponseEntity<?> saveProjectRequestAsDraft(@RequestBody ProjectRequest projectRequest) {
//        try {
//            return ResponseEntity.ok().body(projectRequestService.saveProjectRequestAsDraft(projectRequest));
//        } catch (ProjectRequestNotFoundException | ProjectRequestAlreadySubmittedException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    //    @PutMapping("/projectRequests/editDraft/{id}")
//    public ResponseEntity<?> editProjectRequestInDraft(@RequestBody ProjectRequest projectRequest) {
//        try {
//            return ResponseEntity.ok().body(projectRequestService.editProjectRequestInDraft(projectRequest));
//        } catch (ProjectRequestNotFoundException | ProjectRequestCannotBeModifiedException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

}
