package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Transaction;
import com.altnative.Alt.Native.Service.RevenueService;
import com.altnative.Alt.Native.Service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {
    private final TransactionService transactionService;
    private final RevenueService revenueService;

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> retrieveAllTransactions() {
        return ResponseEntity.ok().body(transactionService.retrieveAllTransactions());
    }

    @PostMapping("/revenue")
    public ResponseEntity<?> retrieveRevenue(@RequestBody DateDto dates) {
        return ResponseEntity.ok().body(revenueService.retrieveRevenueByDate(dates));
    }

    @GetMapping("/sales")
    public ResponseEntity<?> retrieveRefashionerSales() {
        return ResponseEntity.ok().body(revenueService.retrieveRefashionerRevenueByDate());
    }

    @GetMapping("/transaction/{id}")
    public ResponseEntity<?> retrieveTransactionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(transactionService.retrieveTransactionById(id));
        } catch (TransactionNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/admin/transactions")
    public ResponseEntity<?> searchTransactionsByStatus(@RequestParam(required = false) List<String> statuses) {
        ResponseEntity<?> response = null;
        try {
            response = ResponseEntity.ok().body(transactionService.retrieveTransactionsByStatus(statuses));
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
        return response;
    }

    @DeleteMapping("/transaction/delete/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(transactionService.deleteTransaction(id));
        } catch (TransactionNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/transaction/{transactionId}/reject")
    public ResponseEntity<?> rejectTransaction(@PathVariable Long transactionId) {
        try {
            return ResponseEntity.ok().body(transactionService.rejectTransaction(transactionId));
        } catch (TransactionNotFoundException | TransactionAlreadyCompletedException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/transaction/{transactionId}/hold")
    public ResponseEntity<?> holdTransaction(@PathVariable Long transactionId) {
        try {
            return ResponseEntity.ok().body(transactionService.holdTransaction(transactionId));
        } catch (TransactionNotFoundException | TransactionAlreadyCompletedException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/transaction/{transactionId}/accept")
    public ResponseEntity<?> acceptTransaction(@PathVariable Long transactionId) {
        try {
            return ResponseEntity.ok().body(transactionService.acceptTransaction(transactionId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/transaction/event/{transactionId}/accept")
    public ResponseEntity<?> acceptEventTransaction(@PathVariable Long transactionId) {
        try {
            return ResponseEntity.ok().body(transactionService.acceptEventTransaction(transactionId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/transaction/swapRequest/{swapRequestId}")
    public ResponseEntity<?> acceptSwapRequestTransaction(@PathVariable Long transactionId) {
        try {
            return ResponseEntity.ok().body(transactionService.acceptSwapRequestTransaction(transactionId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

//    @PostMapping("/transaction/{transactionId}/addOn/{addOnId}/accept")
//    public ResponseEntity<?> acceptAddOnTransaction(@PathVariable Long transactionId, @PathVariable Long addOnId) {
//        try {
//            return ResponseEntity.ok().body(transactionService.acceptAddOnTransaction(transactionId,addOnId));
//        } catch (TransactionNotFoundException | NoAccessRightsException | TransactionAlreadyCompletedException | OfferNotFoundException | OrderNotFoundException | AddOnNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

//    @PostMapping("/transaction/{transactionId}/order/{orderId}/accept")
//    public ResponseEntity<?> acceptAddOnTransaction2(@PathVariable Long transactionId, @PathVariable Long orderId) {
//        try {
//            return ResponseEntity.ok().body(transactionService.acceptAddOnTransaction(transactionId,orderId));
//        } catch (TransactionNotFoundException | NoAccessRightsException | TransactionAlreadyCompletedException | OfferNotFoundException | OrderNotFoundException | AddOnNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    @PostMapping("/transaction/{transactionId}/order/{orderId}/accept")
    public ResponseEntity<?> acceptAddOnTransaction(@PathVariable Long transactionId, @PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(transactionService.acceptAddOnTransaction(transactionId,orderId));
        } catch (TransactionNotFoundException | NoAccessRightsException | TransactionAlreadyCompletedException | OfferNotFoundException | OrderNotFoundException | AddOnNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/transaction/offers/{offerId}")
    public ResponseEntity<?> retrieveTransactionsByOfferId(@PathVariable Long offerId) {
        try {
            return ResponseEntity.ok().body(transactionService.retrieveTransactionsByOfferId(offerId));
        } catch (OfferNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
