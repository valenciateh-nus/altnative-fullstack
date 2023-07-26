package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Dto.checkout.PaymentInfo;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
@Slf4j
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/setup-intent")
    public ResponseEntity<?> createSetupIntent() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/setup-intent").toUriString());
        try {
            SetupIntent setupIntent = checkoutService.createSetupIntent();
            String setupStr = setupIntent.toJson();
            return ResponseEntity.created(uri).body(setupStr);
        } catch (StripeException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/getCards")
    public ResponseEntity<?> getCards() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/getCards").toUriString());
        try {
            PaymentMethodCollection paymentMethodCollection = checkoutService.getCards();
            String pmStr = paymentMethodCollection.toJson();
            return ResponseEntity.ok().body(pmStr);
        } catch (StripeException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/saveCard/{id}")
    public ResponseEntity<?> saveCard(@PathVariable("id") String id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/saveCard").toUriString());
        try {
            checkoutService.saveCard(id);
            return ResponseEntity.ok().build();
        } catch (StripeException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/removeCard/{id}")
    public ResponseEntity<?> removeCard(@PathVariable("id") String id) {
        try {
            checkoutService.removeCard(id);
            return ResponseEntity.ok().body("Card has been deleted successfully.");
        } catch (StripeException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/purchase/{id}")
    public ResponseEntity<?> placeOrder(@PathVariable Long id) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/purchase").toUriString());
        try {
            return ResponseEntity.created(uri).body(checkoutService.placeOrder(id));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/purchase/{id}/swapItem/{orderId}")
    public ResponseEntity<?> placeSwapItemDeliveryOrder(@PathVariable Long id, @PathVariable Long orderId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/purchase/{id}/swapItem").toUriString());
        try {
            return ResponseEntity.created(uri).body(checkoutService.placeSwapItemDeliveryOrder(id, orderId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/payForDelivery/{deliveryId}")
    public ResponseEntity<?> placeDeliveryOrder(@PathVariable Long deliveryId,  @RequestParam String token) {
        try {
            return ResponseEntity.ok().body(checkoutService.placeDeliveryOrder(deliveryId, token));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/orders/{orderId}/purchaseAddOn/{addOnOfferId}")
    public ResponseEntity<?> placeAddOnOrder(@PathVariable Long orderId, @PathVariable Long addOnOfferId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/orders/{orderId}/purchaseAddOn/{addOnOfferId}").toUriString());
        try {
            return ResponseEntity.created(uri).body(checkoutService.placeAddOnOrder(addOnOfferId, orderId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

//    @PostMapping("/purchaseMpl/{id}")
//    public ResponseEntity<?> placeMPLOrder(@PathVariable Long id) {
//        try {
//            return ResponseEntity.ok().body(checkoutService.placeOrderMPL(id));
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }

    @PostMapping("/declinePayment/{offerId}")
    public ResponseEntity<?> declinePayment(@PathVariable Long offerId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/declinePayment/{id}").toUriString());
        try {
            checkoutService.declinePayment(offerId);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/payment-intent").toUriString());
        try {
            PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
            String paymentStr = paymentIntent.toJson();
            return ResponseEntity.created(uri).body(paymentStr);
        } catch (StripeException | OfferNotFoundException | CreditCardNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // ignore
    @PostMapping("/refund/{disputeId}")
    public ResponseEntity<?> createRefund(@PathVariable Long disputeId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/refund/{disputeId}").toUriString());
        try {
            Refund refund = checkoutService.createRefund(disputeId);
            String refundStr = refund.toJson();
            return ResponseEntity.created(uri).body(refundStr);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/refund/process/{disputeId}")
    public ResponseEntity<?> processRefund(@PathVariable Long disputeId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/refund/process/{disputeId}").toUriString());
        try {
            checkoutService.processRefund(disputeId);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<?> retrieveBalance() {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/checkout/balance").toUriString());
        try {
            Balance balance = checkoutService.retrieveBalance();
            String balanceStr = balance.toJson();
            return ResponseEntity.created(uri).body(balanceStr);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
