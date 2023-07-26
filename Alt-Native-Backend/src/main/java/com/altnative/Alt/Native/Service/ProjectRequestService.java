package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Offer;
import com.altnative.Alt.Native.Model.Project;
import com.altnative.Alt.Native.Model.ProjectRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProjectRequestService {

    ProjectRequest createProjectRequest(Long cId, ProjectRequest projectRequest, List<MultipartFile> files) throws UsernameNotFoundException, CategoryNotFoundException, InvalidFileException, S3Exception;

    ProjectRequest createProjectRequestAsDraft(Long cId, ProjectRequest projectRequest, List<MultipartFile> files) throws UsernameNotFoundException, CategoryNotFoundException, InvalidFileException, S3Exception;

    void addImageToProjectRequest(Long projectRequestId, MultipartFile file) throws ProjectRequestNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException;

    void removeImageFromProjectRequest(Long projectRequestId, Long imageId) throws ProjectRequestNotFoundException, NoAccessRightsException;

    List<ProjectRequest> retrieveAllProjectRequests() throws ProjectRequestNotFoundException;

    List<Offer> retrieveAllOffersToUser() throws ProjectRequestNotFoundException, NoAccessRightsException;

    List<ProjectRequest> retrieveOwnProjectRequests();

    List<ProjectRequest> retrieveAvailableBusinessRequestsByStatus(List<RequestStatus> statuses);

    List<ProjectRequest> searchProjectRequestsByUser(String username, Optional<String> keyword);

    List<ProjectRequest> retrieveProjectRequestsByStatus(List<RequestStatus> statuses, Optional<Boolean> isBusiness);

    List<ProjectRequest> retrieveProjectRequestsByStatus2(List<RequestStatus> statuses) throws ProjectRequestNotFoundException;

    List<ProjectRequest> retrieveProjectRequestsByUsername(String username);

    ProjectRequest retrieveProjectRequestById(Long id) throws ProjectRequestNotFoundException, NoAccessRightsException;

    ProjectRequest editProjectRequestInDraft(Long pId, ProjectRequest newProjectRequest) throws ProjectRequestNotFoundException, ProjectRequestCannotBeModifiedException, NoAccessRightsException;

    ProjectRequest submitProjectRequestInDraft(Long projectRequestId, ProjectRequest projectRequest) throws ProjectRequestNotFoundException, ProjectRequestCannotBeModifiedException, ProjectRequestAlreadySubmittedException, NoAccessRightsException;

    ProjectRequest updateProjectRequest(Long id, ProjectRequest projectRequest) throws ProjectRequestNotFoundException, ProjectRequestCannotBeModifiedException, NoAccessRightsException;

    List<ProjectRequest> searchAllAvailableBusinessRequests(Optional<Long[]> cIds, Optional<String> keyword);

    void deleteProjectRequest(Long id) throws ProjectRequestNotFoundException, NoAccessRightsException;

    List<ProjectRequest> searchProjectRequests(Optional<Long[]> cIds, Optional<String> keyword, Optional<Boolean> isBusiness) throws ProjectRequestNotFoundException;

    List<ProjectRequest> searchAllProjectRequests(Optional<Long[]> cIds, Optional<String> keyword) throws ProjectRequestNotFoundException;

    List<ProjectRequest> searchOwnProjectRequests(Optional<String[]> statuses, Optional<String> keyword) throws ProjectRequestNotFoundException;

    Project retrieveProjectByOrderId(Long id) throws OrderNotFoundException, OfferNotFoundException, NoAccessRightsException;

    List<ProjectRequest> searchAllBusinessRequests(Optional<Long[]> cIds, Optional<String> keyword);

    List<ProjectRequest> retrieveBusinessRequestsByStatus(List<RequestStatus> statuses);

    List<ProjectRequest> searchBusinessRequests(Optional<Long[]> cIds, Optional<String> keyword);

    List<ProjectRequest> retrieveBusinessRequest(List<RequestStatus> statuses);
}
