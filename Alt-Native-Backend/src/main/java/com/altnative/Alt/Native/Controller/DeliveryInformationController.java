//package com.altnative.Alt.Native.Controller;
//
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Model.DeliveryInformation;
//import com.altnative.Alt.Native.Service.DeliveryInformationService;
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
//@RequestMapping("/deliveryInformation")
//@RequiredArgsConstructor
//@Slf4j
//public class DeliveryInformationController {
//    private final DeliveryInformationService deliveryInformationService;
//
//    @PostMapping("/createDeliveryInformation")
//    public ResponseEntity<?> createDeliveryInformation(@RequestBody DeliveryInformation deliveryInformation) {
//        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("deliveryInformation/createDeliveryInformation").toUriString());
//        try {
//            return ResponseEntity.created(uri).body(deliveryInformationService.createDeliveryInformation(deliveryInformation));
//        } catch (InvalidDeliveryInformationException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PostMapping("/updateDeliveryInformation")
//    public ResponseEntity<?> updateDeliveryInformation(@RequestBody DeliveryInformation deliveryInformation) throws DeliveryInformationNotFoundException {
//        try {
//            return ResponseEntity.ok().body(deliveryInformationService.updateDeliveryInformation(deliveryInformation));
//        } catch (DeliveryInformationNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @GetMapping("/retrieveDeliveryInformationByTrackingNumber/{trackingNumber}")
//    public ResponseEntity<?> retrieveDeliveryInformationByTrackingNumber(@PathVariable String trackingNumber) {
//        try {
//            return ResponseEntity.ok().body(deliveryInformationService.retrieveDeliveryInformationByTrackingNumber(trackingNumber));
//        } catch (DeliveryInformationNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @GetMapping("/retrieveAllDeliveryInformation")
//    public ResponseEntity<List<DeliveryInformation>> retrieveAllDeliveryInformation() {
//        return ResponseEntity.ok().body(deliveryInformationService.retrieveAllDeliveryInformation());
//    }
//
//    @GetMapping("/retrieveDeliveryInformationById/{id}")
//    public ResponseEntity<?> retrieveDeliveryInformationById(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(deliveryInformationService.retrieveDeliveryInformationById(id));
//        } catch (DeliveryInformationNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @DeleteMapping("/deleteDeliveryInformation/{id}")
//    public ResponseEntity<?> deleteDeliveryInformation(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(deliveryInformationService.deleteDeliveryInformation(id));
//        } catch (DeliveryInformationNotFoundException | NoAccessRightsException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//}
