package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.CreditCardNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.OfferNotFoundException;
import com.altnative.Alt.Native.Exceptions.TagNotFoundException;
import com.altnative.Alt.Native.Model.Tag;
import com.altnative.Alt.Native.Model.WalletTransaction;
import com.altnative.Alt.Native.Service.TagService;
import com.altnative.Alt.Native.Service.WalletService;
import com.altnative.Alt.Native.Service.WalletTransactionService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
@Slf4j
public class WalletController {
    private final WalletService walletService;
    private final WalletTransactionService walletTransactionService;

    @GetMapping("/transactions/personal")
    public ResponseEntity<List<WalletTransaction>> retrieveOwnTransactions(@RequestParam(defaultValue = "0") Integer page) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/wallet").toUriString());
        return ResponseEntity.created(uri).body(walletService.getTransaction(page));
    }

    @PostMapping("/createPaymentIntent")
    public ResponseEntity<?> deposit(@RequestParam Double amount) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/wallet/deposit/createPaymentIntent").toUriString());
        try {
            return ResponseEntity.created(uri).body(walletTransactionService.createPaymentIntent(amount));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PatchMapping("/:paymentIntentId/approve")
    public ResponseEntity<?> completeTransaction(@PathVariable String paymentIntentId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/wallet/deposit/createPaymentIntent").toUriString());
        try {
            walletTransactionService.completeWalletTransaction(paymentIntentId);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/withdrawRequest")
    public ResponseEntity<?> withdrawRequest(@RequestParam Double amount) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/wallet/withdrawRequest").toUriString());
        try {
            walletService.withdrawRequest(amount);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/withdraw/{walletTransactionId}/approve")
    public ResponseEntity<?> approveWithdrawRequest(@PathVariable Long walletTransactionId,@RequestParam String bankTransactionId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/wallet/withdraw/approve").toUriString());
        try {
            walletService.approveWithdraw(walletTransactionId, bankTransactionId);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/withdraw/{walletTransactionId}/reject")
    public ResponseEntity<?> rejectWithdrawRequest(@PathVariable Long walletTransactionId,@RequestParam String remarks) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/wallet/withdraw" + walletTransactionId.toString() + "/reject").toUriString());
        try {
            walletService.rejectWithdraw(walletTransactionId, remarks);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/transactions/search")
    public ResponseEntity<?> searchTransactions(@RequestParam(required = false) List<String> statuses) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/wallet/transactions/search").toUriString());
        try {
            return ResponseEntity.created(uri).body(walletTransactionService.searchWalletTransactionsByStatus(statuses));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

}
