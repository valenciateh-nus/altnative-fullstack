package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Dto.DeliveryForm;
import com.altnative.Alt.Native.Dto.jnt.Tracking;
import com.altnative.Alt.Native.Exceptions.DeliveryNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoDeliveryExistsException;
import com.altnative.Alt.Native.Exceptions.OrderNotFoundException;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Delivery;
import com.altnative.Alt.Native.Service.DeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class DeliveryController {
    private final DeliveryService deliveryService;

    @PostMapping("/orders/{orderId}/createDelivery")
    public ResponseEntity<?> createDelivery(@PathVariable Long orderId, @RequestBody DeliveryForm createDeliveryForm) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("delivery/createDelivery").toUriString());
        try {
            return ResponseEntity.created(uri).body(deliveryService.createDelivery(orderId, createDeliveryForm));
        } catch (OrderNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapItem/orders/{orderId}/createDelivery")
    public ResponseEntity<?> createDeliveryForSwapItem(@PathVariable Long orderId, @RequestBody DeliveryForm createDeliveryForm) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/swapItem/orders/{orderId}/createDelivery").toUriString());
        try {
            return ResponseEntity.created(uri).body(deliveryService.createDeliveryForSwapItem(orderId, createDeliveryForm));
        } catch (OrderNotFoundException | NoAccessRightsException | ItemNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/swapRequests/{swapRequestId}/createDelivery")
    public ResponseEntity<?> createSwapRequestDelivery(@PathVariable Long swapRequestId, @RequestBody DeliveryForm createDeliveryForm) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/swapRequests/{swapRequestId}/createDelivery").toUriString());
        try {
            return ResponseEntity.created(uri).body(deliveryService.createDeliveryForSwapRequest(swapRequestId, createDeliveryForm));
        } catch (SwapRequestNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/orders/{orderId}/delivery/{deliveryId}/courier")
    public ResponseEntity<?> updateCourierByDeliveryId(@PathVariable Long orderId, @PathVariable Long deliveryId, @RequestBody String courierName) {
        try {
            return ResponseEntity.ok().body(deliveryService.updateCourierByDeliveryId(courierName, deliveryId, orderId));
        } catch (OrderNotFoundException | NoAccessRightsException | DeliveryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/orders/{orderId}/deliveries")
    public ResponseEntity<?> retrieveDeliveriesInOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok().body(deliveryService.retrieveDeliveriesInOrder(orderId));
        } catch (OrderNotFoundException | NoAccessRightsException | NoDeliveryExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/delivery/{id}")
    public ResponseEntity<?> retrieveDeliveryById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok().body(deliveryService.retrieveDeliveryById(id));
        } catch (DeliveryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/deliveries/courier")
    public ResponseEntity<?> retrieveDeliveryByCourierName(@RequestParam String courierName) {
        try {
            return ResponseEntity.ok().body(deliveryService.retrieveAllDeliveriesByCourier(courierName));
        } catch (NoDeliveryExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/delivery/update")
    public ResponseEntity<?> updateDelivery(@RequestBody Delivery delivery) {
        try {
            return ResponseEntity.ok().body(deliveryService.updateDelivery(delivery));
        } catch (DeliveryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @DeleteMapping("/delivery/deleteById/{id}")
    public ResponseEntity<?> deleteDeliveryById(@PathVariable Long id) {
        try {
            deliveryService.deleteDeliveryByDeliveryId(id);
            return ResponseEntity.ok().body("Delivery with ID: " + id + " deleted successfully.");
        } catch (DeliveryNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/delivery/fetchLockerStationList")
    public ResponseEntity<Flux<String>> fetchLockerStationList(@RequestParam String token) {
        return ResponseEntity.ok().body(deliveryService.fetchLockerStationList(token));
    }

    @GetMapping("/delivery/fetchDistributionPoints")
    public ResponseEntity<Flux<String>> fetchDistributionPoints(@RequestParam String token, @RequestParam String service_code) {
        return ResponseEntity.ok().body(deliveryService.fetchDistributionPoints(token, service_code));
    }

    @GetMapping("/delivery/fetchDistributionPointsAsList")
    public ResponseEntity<?> fetchDistributionPointsAsList(@RequestParam String token, @RequestParam String service_code) {
        return ResponseEntity.ok().body(deliveryService.fetchDistributionPointsAsList(token, service_code));
    }

    @PostMapping("/delivery/createJNTDelivery")
    public ResponseEntity<?> testDeliveryJNT(@RequestParam String token, @RequestParam Long deliveryId) {
        try {
            return ResponseEntity.ok().body(deliveryService.createJNTDelivery(token, deliveryId));
        } catch (DeliveryNotFoundException | JNTDeliveryCreationError ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PatchMapping("/delivery/schedulePickup")
    public ResponseEntity<Flux<String>> scheduleJNTPickup(@RequestParam String token, @RequestParam Long deliveryId, @RequestParam String jntTrackingId) throws DeliveryNotFoundException {
        return ResponseEntity.ok().body(deliveryService.schedulePickup(token, deliveryId, jntTrackingId));
    }

    @GetMapping("/delivery/getJNTPricing")
    public ResponseEntity<Flux<String>> getJNTPricing(@RequestParam String token, @RequestParam Double weight, @RequestParam Double length, @RequestParam Double width, @RequestParam Double height) {
        return ResponseEntity.ok().body(deliveryService.getServicePricing(token, weight, length, width, height));
    }

    @GetMapping("/delivery/getJNTStatus")
    public ResponseEntity<Mono<Tracking>> getJNTStatus(@RequestParam String token, @RequestParam Long deliveryId) throws DeliveryNotFoundException {
        return ResponseEntity.ok().body(deliveryService.getJNTStatus(token, deliveryId));
    }

    @GetMapping("/delivery/getJNTInvoice")
    public ResponseEntity<?> getJNTInvoice(@RequestParam String token, @RequestParam String jntTrackingId) {
        return ResponseEntity.ok().body(deliveryService.getJNTInvoice(token, jntTrackingId));
    }
}


