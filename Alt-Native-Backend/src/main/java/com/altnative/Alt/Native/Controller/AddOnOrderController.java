//package com.altnative.Alt.Native.Controller;
//
//import com.altnative.Alt.Native.Exceptions.AddOnOrderNotFoundException;
//import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
//import com.altnative.Alt.Native.Exceptions.OfferNotFoundException;
//import com.altnative.Alt.Native.Exceptions.OrderNotFoundException;
//import com.altnative.Alt.Native.Model.AddOnOrder;
//import com.altnative.Alt.Native.Model.Order2;
//import com.altnative.Alt.Native.Service.AddOnOrderService;
//import com.altnative.Alt.Native.Service.Order2Service;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1")
//@RequiredArgsConstructor
//@Slf4j
//public class AddOnOrderController {
//
//    private final AddOnOrderService addOnOrderService;
//
//    @GetMapping("/addOnOrders/{id}")
//    public ResponseEntity<?> retrieveAddOnOrdersById(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(addOnOrderService.retrieveAddOnOrderById(id));
//        } catch (AddOnOrderNotFoundException | NoAccessRightsException | OfferNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @GetMapping("/addOnOrders/{addOnOrderId}/invoiceNumber")
//    public ResponseEntity<String> retrieveInvoiceNumber(Long addOnOrderId) {
//        try {
//            return ResponseEntity.ok().body(addOnOrderService.retrieveInvoiceNumber(addOnOrderId));
//        } catch (AddOnOrderNotFoundException | NoAccessRightsException | OfferNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @GetMapping("/addOnOrders")
//    public ResponseEntity<List<AddOnOrder>> retrieveAllAddOnOrders() throws AddOnOrderNotFoundException {
//        return ResponseEntity.ok().body(addOnOrderService.retrieveAllAddOnOrders());
//    }
//
//    @PostMapping("/addOnOrders/updateAddOnOrder")
//    public ResponseEntity<?> updateAddOnOrder(@RequestBody AddOnOrder order) {
//        try {
//            return ResponseEntity.ok().body(addOnOrderService.updateAddOnOrder(order));
//        } catch (AddOnOrderNotFoundException | NoAccessRightsException | OfferNotFoundException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PutMapping("/addOnOrders/{addOnOrderId}/complete")
//    public ResponseEntity<?> updateCompletionOfAddOnOrder(@PathVariable Long addOnOrderId) {
//        try {
//            return ResponseEntity.ok().body(addOnOrderService.completeAddOnOrder(addOnOrderId));
//        } catch (AddOnOrderNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//}
