package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Milestone;
import com.altnative.Alt.Native.Model.Order2;
import com.altnative.Alt.Native.Service.AppUserService;
import com.altnative.Alt.Native.Service.Order2Service;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final Order2Service order2Service;
    private final AppUserService appUserService;

//    @PostMapping("/transactions/{transactionId}/orders")
//    public ResponseEntity<?> createOrderForTransaction(@PathVariable Long transactionId, @RequestBody Order2 order) {
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/transactions/{transactionId}/orders").toUriString());
//        try {
//            return ResponseEntity.created(uri).body(order2Service.createOrderForTransaction(transactionId, order));
//        } catch (InvalidOrderException | TransactionNotFoundException | InvalidTransactionException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<?> retrieveOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(order2Service.retrieveOrderById(id));
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/orders/{id}/invoiceNumber")
    public ResponseEntity<String> retrieveInvoiceNumber(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(order2Service.retrieveInvoiceNumber(id));
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<?> retrieveAllOrders() {
        try {
            return ResponseEntity.ok().body(order2Service.retrieveAllOrders());
        } catch (OrderNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // refashionees search for his own orders
    // search by selection of statuses and/or input keyword for title (i.e offer title)
    @GetMapping("/myRefashioneeOrders/search")
    public ResponseEntity<?> searchOwnRefashioneeOrders(@RequestParam Optional<String> status,
                                                        @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (status.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(order2Service.retrieveOwnRefashioneeOrders());
            } else {
                response = ResponseEntity.ok().body(order2Service.searchOwnRefashioneeOrders(status, keyword));
            }
        } catch (OrderNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    // refashioners search for his own orders
    // search by selection of statuses and/or input keyword for title (i.e offer title)
    @GetMapping("/myRefashionerOrders/search")
    public ResponseEntity<?> searchOwnRefashionerOrders(@RequestParam Optional<String> status,
                                                        @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (status.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(order2Service.retrieveOwnRefashionerOrders());
            } else {
                response = ResponseEntity.ok().body(order2Service.searchOwnRefashionerOrders(status, keyword));
            }
        } catch (OrderNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    // user search for his own mpl orders
    // search by selection of statuses and/or input keyword for title (i.e offer title)
    @GetMapping("/myMplOrders/search")
    public ResponseEntity<?> searchOwnMplOrders(@RequestParam Optional<String[]> statuses,
                                                @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        try {
            if (statuses.isEmpty() && keyword.isEmpty()) {
                response = ResponseEntity.ok().body(order2Service.retrieveOwnMplOrders());
            } else {
                response = ResponseEntity.ok().body(order2Service.searchOwnMplOrders(statuses, keyword));
            }
        } catch (OrderNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

//    @GetMapping("/orders")
//    public ResponseEntity<?> retrieveOrdersOfLoggedInUser() {
//        try {
//            return ResponseEntity.ok().body(order2Service.retrieveOrdersByUsername(appUserService.getCurrUsername()));
//        } catch (OrderNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

//    @GetMapping("/appUsers/{username}/orders")
//    public ResponseEntity<?> retrieveOrdersByUsername(String username) {
//        try {
//            return ResponseEntity.ok().body(order2Service.retrieveOrdersByUsername(username));
//        } catch (OrderNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

//    @GetMapping("/orders/{id}/addons")
//    public ResponseEntity<?> retrieveAddOnsByOrderId(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(order2Service.retrieveAddOnsByOrderId(id));
//        } catch (OrderNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    @DeleteMapping("/orders/{id}/addons/{addOnId}")
    public ResponseEntity<?> deleteOrderAddOns(@PathVariable Long id, @PathVariable Long addOnId) {
        try {
            order2Service.deleteOrderAddOns(id, addOnId);
            return ResponseEntity.ok().body("Add ons for Order with ID: " + id + " deleted successfully.");
        } catch (OrderNotFoundException | AddOnNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/orders/updateOrder")
    public ResponseEntity<?> updateOrder(@RequestBody Order2 order) {
        try {
            return ResponseEntity.ok().body(order2Service.updateOrder(order));
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    //
//    @PostMapping("/marketplaceListings/{marketplaceListingId}/orders")
//    public ResponseEntity<?> createOrderForMarketplaceListing(@PathVariable Long marketplaceListingId, @RequestBody Order order) {
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/marketplaceListings/{marketplaceListingId}/orders").toUriString());
//        try {
//            return ResponseEntity.created(uri).body(orderService.createOrderForMarketplaceListing(marketplaceListingId, order));
//        } catch (InvalidOrderException | MarketplaceListingNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    //    @GetMapping("/marketplaceListings/{id}")
//    public ResponseEntity<?> retrieveOrdersFromMarketplaceListing(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(orderService.retrieveOrdersFromMarketplaceListing(id));
//        } catch (MarketplaceListingNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

//    @DeleteMapping("/marketplaceListings/{id}/orders/{orderId}")
//    public ResponseEntity<?> deleteMarketplaceOrder(@PathVariable Long id, @PathVariable Long orderId) {
//        try {
//            orderService.deleteMarketplaceOrder(id, orderId);
//            return ResponseEntity.ok().body("Order with ID: " + id + " deleted successfully.");
//        } catch (OrderNotFoundException | MarketplaceListingNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    @GetMapping("/orders/completedProjects")
    public ResponseEntity<?> retrieveAllCompletedProjects() {
        return ResponseEntity.ok().body(order2Service.retrieveAllCompletedOrdersForPRandPL());
    }

    @GetMapping("/orders/{orderId}/completionDate")
    public ResponseEntity<?> retrieveCompletionDate(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(order2Service.retrieveProposedCompletionDate(orderId));
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/orders/{orderId}/daysUntilCompletion")
    public ResponseEntity<?> retrieveDaysLeftUntilCompletion(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(order2Service.retrieveDaysLeftUntilCompletion(orderId));
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/orders/{orderId}/complete")
    public ResponseEntity<?> updateCompletionOfOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(order2Service.completeOrder(orderId));
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/orders/{orderId}/requestProgressUpdate")
    public ResponseEntity<?> requestProgressUpdate(@PathVariable Long orderId, @RequestBody Optional<String> remarks) {
        try {
            order2Service.requestProgressUpdate(orderId, remarks);
            return ResponseEntity.ok().body("Progress update requested successfully!");
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/orders/{orderId}/approveFinalProduct")
    public ResponseEntity<?> approveFinalProduct(@PathVariable Long orderId, @RequestBody Optional<String> remarks) {
        try {
            order2Service.approveFinalProduct(orderId, remarks);
            return ResponseEntity.ok().body("You have approved the final product sent by the refashioner.");
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/orders/{orderId}/rejectFinalProduct")
    public ResponseEntity<?> rejectFinalProduct(@PathVariable Long orderId, @RequestBody Optional<String> remarks) {
        try {
            order2Service.rejectFinalProduct(orderId, remarks);
            return ResponseEntity.ok().body("You have rejected the final product sent by the refashioner.");
        } catch (OrderNotFoundException | NoAccessRightsException | RejectFinalProductErrorException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/orders/{orderId}/addProgressUpdate")
    public ResponseEntity<?> addProgressUpdatePhotos(@RequestPart(value = "files", required = true) List<MultipartFile> files, @RequestPart Optional<String> remarks, @PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(order2Service.addProgressUpdatePhotos(files, orderId, remarks));
        } catch (OrderNotFoundException | NoAccessRightsException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/orders/{orderId}/addFinalProductPhotos")
    public ResponseEntity<?> addFinalApprovalUpdatePhotos(@RequestPart(value = "files", required = true) List<MultipartFile> files, @RequestPart Optional<String> remarks, @PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(order2Service.addFinalApprovalUpdatePhotos(files, orderId, remarks));
        } catch (OrderNotFoundException | NoAccessRightsException | InvalidFileException | S3Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
