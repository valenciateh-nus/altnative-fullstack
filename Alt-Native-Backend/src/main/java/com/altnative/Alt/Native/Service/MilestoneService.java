package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Model.Milestone;
import com.altnative.Alt.Native.Model.Order2;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface MilestoneService {


    Milestone createMilestone(List<MultipartFile> files, Milestone milestone, Long orderId) throws OrderNotFoundException, NoAccessRightsException, InvalidFileException, S3Exception;

    List<Milestone> retrieveMilestonesForOrder(Long orderId, Optional<String> token) throws OrderNotFoundException, NoMilestoneExistsException, NoAccessRightsException;

    List<Milestone> retrieveAllAddOnMilestones(Long addOnId) throws NoMilestoneExistsException, AddOnNotFoundException;

    Milestone retrieveMilestoneById(Long id) throws MilestoneNotFoundException, NoAccessRightsException;

    Milestone updateMilestone(Milestone milestone) throws MilestoneNotFoundException, NoAccessRightsException;

    void deleteMilestoneById(Long id) throws MilestoneNotFoundException, NoAccessRightsException;
    }
