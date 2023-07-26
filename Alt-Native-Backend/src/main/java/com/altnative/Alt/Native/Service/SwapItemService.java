package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.ItemCondition;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Category;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Model.MarketplaceListing;
import com.altnative.Alt.Native.Model.SwapItem;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SwapItemService {

    SwapItem createSwapItem(String itemName, String itemDescription, Long categoryId, List<MultipartFile> imageList, ItemCondition itemCondition, Integer credits) throws NoAccessRightsException, InvalidFileException, S3Exception, ImageCannotBeEmptyException, CategoryNotFoundException;

    void deleteSwapItem(Long itemId) throws ItemNotFoundException, NoAccessRightsException;

    SwapItem updateSwapItem(Long itemId, SwapItem newSwapItem) throws ItemNotFoundException, NoAccessRightsException;

    void addImageToSwapItem(Long itemId, MultipartFile file) throws ItemNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException;

    void removeImageFromSwapItem(Long itemId, Long imageId) throws ItemNotFoundException, NoAccessRightsException, ImageNotFoundException;

    SwapItem retrieveSwapItemById(Long itemId) throws ItemNotFoundException, NoAccessRightsException;

    List<SwapItem> retrieveListOfSwapItems() throws NoAccessRightsException, NoSwapItemsExistException;

    SwapItem purchaseSwapItem(Long itemId) throws ItemNotFoundException, InsufficientCreditsException;

}
