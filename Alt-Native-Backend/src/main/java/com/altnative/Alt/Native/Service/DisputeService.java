package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Enum.DisputeStatus;
import com.altnative.Alt.Native.Enum.MilestoneEnum;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Dispute;
import com.altnative.Alt.Native.Model.Image;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import com.stripe.model.Refund;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface DisputeService {

    Dispute createDispute(Long orderId, Dispute dispute, List<MultipartFile> photos) throws OrderNotFoundException, NoAccessRightsException, InvalidRefundAmountException, InvalidFileException, S3Exception;

    String deleteDispute(Long disputeId) throws DisputeNotFoundException, NoAccessRightsException;

    Dispute retrieveDisputeByDisputeId(Long disputeId) throws DisputeNotFoundException, NoAccessRightsException;

    List<Dispute> retrieveListOfDisputes() throws NoAccessRightsException;

    List<Dispute> retrieveListOfDisputesByUserId(Long appUserId) throws UserDoesNotExistException, NoAccessRightsException;

    List<Dispute> retrieveDisputesOfOrder(Long orderId) throws OrderNotFoundException, NoAccessRightsException;

    Dispute editDispute(Dispute newDispute) throws DisputeNotFoundException, NoAccessRightsException;

    void addImageToDispute(Long disputeId, MultipartFile file) throws DisputeNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException;

    void removeImageFromDispute(Long disputeId, Long imageId) throws DisputeNotFoundException, NoAccessRightsException;

    Dispute updateDisputeStatus(Long disputeId, String adminRemarks, DisputeStatus newStatus, MilestoneEnum milestoneEnum) throws DisputeNotFoundException, NoAccessRightsException, OrderNotFoundException;

    Dispute acceptDispute(Long disputeId) throws Exception;

    Dispute rejectDispute(Long disputeId, String rejectRemarks) throws DisputeNotFoundException, NoAccessRightsException, OrderNotFoundException;

    void settleDispute(Long disputeId) throws DisputeNotFoundException, NoAccessRightsException;

    Dispute endDispute(Long disputeId, String adminRemarks) throws DisputeNotFoundException, NoAccessRightsException, OrderNotFoundException;

    List<Dispute> filterDisputesByStatus(Optional<String[]> statuses) throws NoAccessRightsException;

    List<Dispute> retrievePendingReviewDisputes() throws NoAccessRightsException;

    Dispute editDispute(Long id, Dispute newDispute) throws DisputeNotFoundException, NoAccessRightsException;

    Double retrieveRefundsByDate(DateDto dates);

    Double retrieveRefundsByRefashionerAndDate();
}
