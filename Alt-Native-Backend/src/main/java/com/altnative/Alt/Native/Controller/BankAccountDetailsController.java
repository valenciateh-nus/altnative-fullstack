package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.BankAccountDetailsNotFoundException;
import com.altnative.Alt.Native.Exceptions.InvalidBankAccountDetailsException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Model.BankAccountDetails;
import com.altnative.Alt.Native.Service.BankAccountDetailsService;
import com.amazonaws.Response;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.constraints.Digits;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bankAccountDetails")
@RequiredArgsConstructor
@Slf4j
public class BankAccountDetailsController {
    private final BankAccountDetailsService bankAccountDetailsService;

    @PostMapping("/createBankAccountDetails")
    public ResponseEntity<?> createBankAccountDetails(@RequestPart BankAccountDetails bad, @RequestPart MultipartFile file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/bankAccountDetails/createBankAccountDetails").toUriString());
        try {
            return ResponseEntity.created(uri).body(bankAccountDetailsService.createBankAccountDetails(bad, file));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/retrieveBankAccountDetailsByNumber")
    public ResponseEntity<?> retrieveBankAccountDetailsByNumber(@RequestBody String bankAccountNumber) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/bankAccountDetails/retrieveBankAccountDetailsByNumber").toUriString());
        try {
            return ResponseEntity.created(uri).body(bankAccountDetailsService.retrieveBankAccountDetailsByNumber(bankAccountNumber));
        } catch (BankAccountDetailsNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/verify/{id}")
    public ResponseEntity<?> verifyBankAccount(@PathVariable("id") Long id) {
        try {
            bankAccountDetailsService.verifyBankAccount(id);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectBankAccount(@PathVariable("id") Long id, @RequestParam String rejectionReason) {
        try {
            bankAccountDetailsService.rejectBankAccount(id, rejectionReason);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/retrieveAllBankAccountDetails")
    public ResponseEntity<?> retrieveAllBankAccountDetails() {
        try {
            return ResponseEntity.ok().body(bankAccountDetailsService.retrieveAllBankAccountDetails());
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/retrieveBankAccountDetailsById/{id}")
    public ResponseEntity<?> retrieveBankAccountDetailsById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(bankAccountDetailsService.retrieveBankAccountDetailsById(id));
        } catch (BankAccountDetailsNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/retrieveUnverifiedBankAccountDetails")
    public ResponseEntity<?> retrieveUnverifiedBankAccountDetails() {
        try {
            return ResponseEntity.ok().body(bankAccountDetailsService.retrieveAllUnverifiedBankAccountDetails());
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/deleteBankAccountDetails/{id}")
    public ResponseEntity<?> deleteBankAccountDetails(@PathVariable Long id) {
        try {
            bankAccountDetailsService.deleteBankAccountDetail(id);
            return ResponseEntity.ok().body("Bank account with id: " + id + " deleted successfully.");
        } catch (BankAccountDetailsNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
