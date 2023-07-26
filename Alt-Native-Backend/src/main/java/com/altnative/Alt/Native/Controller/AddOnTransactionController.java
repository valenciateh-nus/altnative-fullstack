//package com.altnative.Alt.Native.Controller;
//
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Model.AddOnTransaction;
//import com.altnative.Alt.Native.Model.Transaction;
//import com.altnative.Alt.Native.Service.AddOnService;
//import com.altnative.Alt.Native.Service.AddOnTransactionService;
//import com.amazonaws.Response;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
//
//import javax.validation.Valid;
//import java.net.URI;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1")
//@RequiredArgsConstructor
//@Slf4j
//public class AddOnTransactionController {
//
//    private final AddOnTransactionService addOnTransactionService;
//
//    @GetMapping("/addOnTransactions")
//    public ResponseEntity<List<AddOnTransaction>> retrieveAllAddOnTransactions() {
//        return ResponseEntity.ok().body(addOnTransactionService.retrieveAllAddOnTransactions());
//    }
//
//    @GetMapping("/addOnTransaction/{id}")
//    public ResponseEntity<?> retrieveAddOnTransactionById(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(addOnTransactionService.retrieveAddOnTransactionById(id));
//        } catch (AddOnTransactionNotFoundException | OfferNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @DeleteMapping("/addOnTransaction/delete/{id}")
//    public ResponseEntity<?> deleteAddOnTransaction(@PathVariable Long id){
//        try {
//            return ResponseEntity.ok().body(addOnTransactionService.deleteAddOnTransaction(id));
//        } catch (AddOnTransactionNotFoundException | NoAccessRightsException | OfferNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PostMapping("/addOnTransaction/{addOnTransactionId}/reject")
//    public ResponseEntity<?> rejectAddOnTransaction(@PathVariable Long addOnTransactionId) {
//        try {
//            return ResponseEntity.ok().body(addOnTransactionService.rejectAddOnTransaction(addOnTransactionId));
//        } catch (AddOnTransactionNotFoundException | AddOnTransactionAlreadyCompletedException | NoAccessRightsException | OfferNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PostMapping("/addOnTransaction/{addOnTransactionId}/hold")
//    public ResponseEntity<?> holdAddOnTransaction(@PathVariable Long addOnTransactionId) {
//        try {
//            return ResponseEntity.ok().body(addOnTransactionService.holdAddOnTransaction(addOnTransactionId));
//        } catch (AddOnTransactionNotFoundException | AddOnTransactionAlreadyCompletedException | NoAccessRightsException | OfferNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PostMapping("/addOnTransaction/{addOnTransactionId}/accept")
//    public ResponseEntity<?> acceptAddOnTransaction(@PathVariable Long addOnTransactionId) {
//        try {
//            return ResponseEntity.ok().body(addOnTransactionService.acceptAddOnTransaction(addOnTransactionId));
//        } catch (AddOnTransactionNotFoundException | AddOnTransactionAlreadyCompletedException | NoAccessRightsException | OfferNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//}
