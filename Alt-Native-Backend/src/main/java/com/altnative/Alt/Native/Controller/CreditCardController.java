//package com.altnative.Alt.Native.Controller;
//
//import com.altnative.Alt.Native.Exceptions.CreditCardNotFoundException;
//import com.altnative.Alt.Native.Exceptions.InvalidCreditCardException;
//import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
//import com.altnative.Alt.Native.Model.CreditCard;
//import com.altnative.Alt.Native.Service.CreditCardService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
//
//import java.net.URI;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1")
//@RequiredArgsConstructor
//@Slf4j
//public class CreditCardController {
//
//    private final CreditCardService creditCardService;
//
////    @PostMapping("/creditCard")
////    public ResponseEntity<?> createCreditCard(@RequestBody CreditCard creditCard) {
////        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("creditCard/createCreditCard").toUriString());
////        try {
////            return ResponseEntity.created(uri).body(creditCardService.createCreditCard(creditCard));
////        } catch (InvalidCreditCardException ex) {
////            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
////        }
////    }
//
//    @GetMapping("/creditCard/cardNumber/{cardNumber}")
//    public ResponseEntity<?> retrieveCreditCardByCardNumber(@PathVariable String cardNumber) {
//        try {
//            return ResponseEntity.ok().body(creditCardService.retrieveCreditCardByCardNumber(cardNumber));
//        } catch (CreditCardNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PostMapping("/creditCard/update")
//    public ResponseEntity<?> updateCreditCard(@RequestBody CreditCard creditCard) throws CreditCardNotFoundException {
//        try {
//            return ResponseEntity.ok().body(creditCardService.updateCreditCard(creditCard));
//        } catch (CreditCardNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @GetMapping("/creditCards")
//    public ResponseEntity<List<CreditCard>> retrieveAllCreditCards() {
//        return ResponseEntity.ok().body(creditCardService.retrieveAllCreditCards());
//    }
//
//    @GetMapping("/creditCard/{id}")
//    public ResponseEntity<?> retrieveCreditCardById(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(creditCardService.retrieveCreditCardById(id));
//        } catch (CreditCardNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @DeleteMapping("/creditCard/{id}")
//    public ResponseEntity<?> deleteCreditCardById(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(creditCardService.deleteCreditCard(id));
//        } catch (CreditCardNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//}
