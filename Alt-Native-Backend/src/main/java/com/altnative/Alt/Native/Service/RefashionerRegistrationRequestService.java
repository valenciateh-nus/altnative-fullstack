package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.RefashionerRegistrationRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RefashionerRegistrationRequestService {
    public RefashionerRegistrationRequest createRefashionerRegistrationRequest(RefashionerRegistrationRequest refashionerRegistrationRequest, List<MultipartFile> files) throws RefashionerRegistrationRequestFailedException, InvalidFileException, S3Exception;

    void approveRefashionerRegistrationRequest(Long rrrId) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException, RefashionerRegistrationRequestFailedException;

    void approveRefashionerRegistrationRequestWithCertifications(Long refashionerRegistrationRequestId, List<String> certifiedCertifications) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException, RefashionerRegistrationRequestFailedException;

    void addRefashionerCertification(Long refashionerId, String certification) throws NotARefashionerException, NoAccessRightsException;

    void rejectRefashionerRegistrationRequest(Long rrrId) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException, RefashionerRegistrationRequestFailedException;

    List<RefashionerRegistrationRequest> retrieveRejectedRefashionerRegistrationRequestsByUserId(Long userId) throws NoRefashionerRegistrationRequestExistsException;

    List<RefashionerRegistrationRequest> retrieveRefashionerRegistrationRequestsByUserId(Long userId) throws NoRefashionerRegistrationRequestExistsException;

    RefashionerRegistrationRequest retrieveRefashionerRegistrationRequestById(Long id) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException;

    RefashionerRegistrationRequest updateRefashionerRegistrationRequest(RefashionerRegistrationRequest refashionerRegistrationRequest) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException;

    void deleteRefashionerRegistrationRequestById(Long id) throws RefashionerRegistrationRequestNotFoundException, NoAccessRightsException;

    List<RefashionerRegistrationRequest> retrieveAllRefashionerRegistrationRequests() throws NoRefashionerRegistrationRequestExistsException;

    public Integer retrieveNoOfNewRefashioners(DateDto dates);
}
