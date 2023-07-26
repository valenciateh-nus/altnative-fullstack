package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Enum.AddOnStatus;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AddOn;
import com.altnative.Alt.Native.Model.Offer;
import com.altnative.Alt.Native.Service.AddOnService;
import com.altnative.Alt.Native.Service.OfferService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class AddOnController {

    private final AddOnService addOnService;

    @GetMapping("/addOns")
    public ResponseEntity<List<AddOn>> retrieveAllAddOns() throws AddOnNotFoundException {
        return ResponseEntity.ok().body(addOnService.retrieveAllAddOns());
    }

    @GetMapping("/addOns/{addOnId}")
    public ResponseEntity<?> retrieveAddOnByAddOnId(@PathVariable Long addOnId) throws AddOnNotFoundException {
        try {
            return ResponseEntity.ok().body(addOnService.retrieveAddOnById(addOnId));
        } catch (AddOnNotFoundException | OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/order/{orderId}/addOns")
    public ResponseEntity<?> retrieveAddOnsByOrderId(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(addOnService.retrieveAddOnsByOrderId(orderId));
        } catch (OrderNotFoundException | OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/addOns/update")
    public ResponseEntity<?> updateAddOn(@RequestBody AddOn addOn) {
        try {
            return ResponseEntity.ok().body(addOnService.updateAddOn(addOn));
        } catch (AddOnNotFoundException | OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/addOns/{addOnId}/delete")
    public ResponseEntity<?> deleteAddOn(@PathVariable Long addOnId) {
        try {
            addOnService.deleteAddOn(addOnId);
            return ResponseEntity.ok().body("Add On with id: " + addOnId + " deleted successfully!");
        } catch (AddOnNotFoundException | OfferNotFoundException | NoAccessRightsException | OrderNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/addOns/{addOnId}/statusUpdate")
    public ResponseEntity<?> updateAddOnStatusByAddOnId(@PathVariable Long addOnId, @RequestBody AddOnStatus addOnStatus) {
        try {
            return ResponseEntity.ok().body(addOnService.updateAddOnStatusByAddOnId(addOnId, addOnStatus));
        } catch (AddOnNotFoundException | OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}