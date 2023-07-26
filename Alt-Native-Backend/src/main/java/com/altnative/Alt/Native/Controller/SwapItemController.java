package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.SwapItem;
import com.altnative.Alt.Native.Model.SwapRequest;
import com.altnative.Alt.Native.Service.SwapItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class SwapItemController {
    private final SwapItemService swapItemService;

    @PostMapping("/swapItem/category/{categoryId}")
    public ResponseEntity<?> createSwapItem(@RequestPart SwapItem swapItem, @PathVariable Long categoryId, @RequestPart(value = "files", required = true) List<MultipartFile> imageList) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/swapRequest").toUriString());
        try {
            return ResponseEntity.created(uri).body(swapItemService.createSwapItem(swapItem.getTitle(), swapItem.getDescription(), categoryId, imageList, swapItem.getItemCondition(), swapItem.getCredits()));
        } catch (InvalidFileException | S3Exception | ImageCannotBeEmptyException | CategoryNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/swapItem/{itemId}/delete")
    public ResponseEntity<?> deleteSwapItem(@PathVariable Long itemId) {
        try {
            swapItemService.deleteSwapItem(itemId);
            return ResponseEntity.ok().body("Item with id: " + itemId + " deleted successfully");
        } catch (NoAccessRightsException | ItemNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/swapItem/{itemId}/update")
    public ResponseEntity<?> updateSwapItem(@PathVariable Long itemId, @RequestBody SwapItem swapItem) {
        try {
            return ResponseEntity.ok().body(swapItemService.updateSwapItem(itemId, swapItem));
        } catch (NoAccessRightsException | ItemNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapItem/{itemId}/addImage")
    public ResponseEntity<?> addImageToSwapItem(@PathVariable Long itemId, @RequestPart(value = "file", required = true) MultipartFile file) {
        try {
            swapItemService.addImageToSwapItem(itemId, file);
            return ResponseEntity.ok().body("Image has been added successfully.");
        } catch (InvalidFileException | S3Exception | NoAccessRightsException | ItemNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/swapItem/{itemId}/deleteImage/{imageId}")
    public ResponseEntity<?> removeImageFromSwapItem(@PathVariable Long itemId, @PathVariable Long imageId) {
        try {
            swapItemService.removeImageFromSwapItem(itemId, imageId);
            return ResponseEntity.ok().body("Image has been removed successfully.");
        } catch (ImageNotFoundException | NoAccessRightsException | ItemNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/swapItem/{itemId}")
    public ResponseEntity<?> retrieveSwapItemById(@PathVariable Long itemId) {
        try {
            return ResponseEntity.ok().body(swapItemService.retrieveSwapItemById(itemId));
        } catch (NoAccessRightsException | ItemNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/swapItems")
    public ResponseEntity<?> retrieveSwapItems() {
        try {
            return ResponseEntity.ok().body(swapItemService.retrieveListOfSwapItems());
        } catch (NoAccessRightsException | NoSwapItemsExistException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapItem/{itemId}/purchase")
    public ResponseEntity<?> purchaseSwapItem(@PathVariable Long itemId) {
        try {

            return ResponseEntity.ok().body(swapItemService.purchaseSwapItem(itemId));
        } catch (ItemNotFoundException | InsufficientCreditsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
