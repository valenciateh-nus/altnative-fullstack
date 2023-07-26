package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.FollowUpStatus;
import com.altnative.Alt.Native.Enum.ItemCondition;
import com.altnative.Alt.Native.Enum.SwapRequestStatus;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Model.SwapRequest;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.Multipart;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface SwapRequestService {

    SwapRequest createSwapRequest(String itemName, String itemDescription, Long categoryId, List<MultipartFile> imageList, ItemCondition itemCondition) throws InvalidFileException, S3Exception, ImageCannotBeEmptyException, CategoryNotFoundException;

    SwapRequest updateTrackingNumberForSwapRequest(Long swapRequestId, String trackingNumber) throws SwapRequestNotFoundException, NoAccessRightsException;

    SwapRequest updateStatusForSwapRequest(Long swapRequestId, SwapRequestStatus swapRequestStatus) throws SwapRequestNotFoundException, NoAccessRightsException;

    SwapRequest retrieveSwapRequestById(Long swapRequestId) throws SwapRequestNotFoundException, NoAccessRightsException;

    List<SwapRequest> retrieveListOfSwapRequests() throws NoAccessRightsException;

    SwapRequest approveSwapRequest(Long swapRequestId, Integer credits) throws SwapRequestAlreadyCreditedException, SwapRequestNotFoundException, NoAccessRightsException;

    SwapRequest rejectSwapRequestWithCredits(Long swapRequestId, String remarks, Integer credits) throws SwapRequestAlreadyCreditedException, SwapRequestNotFoundException, NoAccessRightsException;

    SwapRequest rejectSwapRequest(Long swapRequestId, String remarks) throws SwapRequestNotFoundException, NoAccessRightsException;

    void deleteSwapRequest(Long swapRequestId) throws SwapRequestNotFoundException, NoAccessRightsException;

    List<SwapRequest> retrieveOwnSwapRequests();

    SwapRequest followUpRejectedItem(Long swapRequestId, FollowUpStatus followUpStatus) throws SwapRequestNotFoundException, NoAccessRightsException;

    SwapRequest updateFollowUpStatusToComplete(Long swapRequestId) throws SwapRequestNotFoundException, SwapRequestAlreadyCompletedException, NoAccessRightsException;
}
