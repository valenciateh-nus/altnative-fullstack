package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.checkout.PaymentInfo;
import com.altnative.Alt.Native.Enum.*;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;

import com.altnative.Alt.Native.Model.Dispute;
import com.altnative.Alt.Native.Repository.DisputeRepo;
import com.altnative.Alt.Native.Repository.MarketplaceListingRepo;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.param.CustomerListPaymentMethodsParams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class CheckoutServiceImpl implements CheckoutService {

    private TransactionService transactionService;
    private OfferService offerService;
    private UserService userService;
    private AppUserService appUserService;
    private Order2Service order2Service;
    private DeliveryService deliveryService;
    private DisputeRepo disputeRepo;
    private MarketplaceListingRepo marketplaceListingRepo;

    public CheckoutServiceImpl(OfferService offerService, TransactionService transactionService, UserService userService, AppUserService appUserService,
                               DisputeRepo disputeRepo, Order2Service order2Service, DeliveryService deliveryService, @Value("${STRIPE_SECRET_KEY}") String secretKey) {
        this.offerService = offerService;
        this.transactionService = transactionService;
        this.userService = userService;
        this.appUserService = appUserService;
        this.order2Service = order2Service;
        this.disputeRepo = disputeRepo;
        this.deliveryService = deliveryService;
        // initialize Stripe API with secret key
        Stripe.apiKey = secretKey;
    }

    @Override
    public Transaction placeOrder(Long offerId) throws Exception {

        // retrieve offer entity by id
        Offer offer = offerService.retrieveOfferById(offerId);
        PaymentIntent paymentIntent = PaymentIntent.retrieve(offer.getPaymentIntentId());
        // retrieve latest transaction
        Transaction transaction = offer.getTransactions().get(offer.getTransactions().size() - 1);

        // card has been authorized
        if (paymentIntent.getStatus().equalsIgnoreCase("requires_capture")) {
            try {
                System.out.println("capturing");
                // offer & transaction status becomes ACCEPTED
                offerService.acceptOffer(offerId);
                transaction = transactionService.acceptTransaction(transaction.getId());
                Order2 order = transaction.getOrder2();
                if (order != null) {
                    // make capture request
                    PaymentIntent updatedPaymentIntent = paymentIntent.capture();
                }
                return transaction;
            } catch (Exception ex) {
                offer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
                paymentIntent.setStatus("requires_payment_method");
                paymentIntent.cancel();
                transactionService.rejectTransaction(transaction.getId());
                Transaction t = new Transaction();
                t.setOfferId(offer.getId());
                t.setAmount(offer.getPrice());
                t.setDateCreated(Calendar.getInstance().getTime());
                t.setPaymentStatus(PaymentStatus.PENDING);
                t.setPaymentIntentId(paymentIntent.getId());
                transactionService.createTransaction(offer.getId(), t);
                throw new Exception(ex.getMessage());
            }
        } else {
            offer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
            transactionService.rejectTransaction(transaction.getId());

            paymentIntent.setStatus("requires_payment_method");
            paymentIntent.cancel();
            Transaction t = new Transaction();
            t.setOfferId(offer.getId());
            t.setAmount(offer.getPrice());
            t.setDateCreated(Calendar.getInstance().getTime());
            t.setPaymentStatus(PaymentStatus.PENDING);
            t.setPaymentIntentId(paymentIntent.getId());
            transactionService.createTransaction(offer.getId(), t);
            return t;
        }
    }

    @Override
    public Transaction placeSwapItemDeliveryOrder(Long offerId, Long orderId) throws Exception {

        // retrieve offer entity by id
        log.info("OFFER ID " + offerId);
        Offer offer = offerService.retrieveOfferById(offerId);
        log.info("OFFER" + offer.getOfferType());
        PaymentIntent paymentIntent = PaymentIntent.retrieve(offer.getPaymentIntentId());
        // retrieve latest transaction
        Transaction transaction = offer.getTransactions().get(offer.getTransactions().size() - 1);

        // card has been authorized
        if (paymentIntent.getStatus().equalsIgnoreCase("requires_capture")) {
//            if (paymentIntent.getStatus().equalsIgnoreCase("requires_payment_method")) { //for backend testing purposes
            // offer & transaction status becomes ACCEPTED
            offerService.acceptOffer(offerId);
            transaction = transactionService.acceptSwapOutTransaction(transaction.getId(), orderId);
            SwapItem swapItem = transaction.getSwapItem();
            System.out.println("entering here");
            return transaction;
        } else {
            System.out.println("entering here 2");
            offer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
            transactionService.rejectTransaction(transaction.getId());

            paymentIntent.setStatus("requires_payment_method");
            Transaction t = new Transaction();
            t.setOfferId(offer.getId());
            t.setAmount(offer.getPrice());
            t.setDateCreated(Calendar.getInstance().getTime());
            t.setPaymentStatus(PaymentStatus.PENDING);
            t.setPaymentIntentId(paymentIntent.getId());
            transactionService.createTransaction(offer.getId(), t);
            return t;
        }
    }

    // ignore
    @Override
    public Dispute processRefund(Long disputeId) throws Exception {
        Optional<Dispute> d = disputeRepo.findById(disputeId);
        Dispute dispute = d.get();
        Refund refund = Refund.retrieve(dispute.getRefundId());
        if (refund.getStatus().equalsIgnoreCase("succeeded")) {
            dispute.setDisputeStatus(DisputeStatus.DISPUTE_REQUEST_COMPLETED);
            dispute.setAdminRemarks("Item has been refunded with the amount: SGD $" + dispute.getRefundAmount());
        } else {
            dispute.setDisputeStatus(DisputeStatus.REFUND_FAILED);
            dispute.setAdminRemarks("Refund has failed. Please wait for assistance from admin.");
        }
        return disputeRepo.save(dispute);
    }

    @Override
    public Transaction placeAddOnOrder(Long addOnOfferId, Long orderId) throws Exception {
        Offer addOnOffer = offerService.retrieveOfferById(addOnOfferId);

        PaymentIntent paymentIntent = PaymentIntent.retrieve(addOnOffer.getPaymentIntentId());
        Transaction transaction = addOnOffer.getTransactions().get(addOnOffer.getTransactions().size() - 1); //retrieve latest transaction
        if (paymentIntent.getStatus().equalsIgnoreCase("requires_capture")) {
            offerService.acceptOffer(addOnOfferId);
            transaction = transactionService.acceptAddOnTransaction(transaction.getId(), orderId);
            Order2 order = transaction.getOrder2();
            if (order != null) {
                log.info("payment intent capture running");
                PaymentIntent updatedPaymentIntent = paymentIntent.capture();
            }
            return transaction;
        } else {
            addOnOffer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
            transactionService.rejectTransaction(transaction.getId());

            paymentIntent.setStatus("requires_payment_method");
            Transaction t = new Transaction();
            t.setOfferId(addOnOfferId);
            t.setAmount(addOnOffer.getPrice());
            t.setDateCreated(Calendar.getInstance().getTime());
            t.setPaymentStatus(PaymentStatus.PENDING);
            t.setPaymentIntentId(paymentIntent.getId());
            transactionService.createTransaction(addOnOfferId, t);
            return t;
        }
    }

    @Override
    public Transaction placeDeliveryOrder(Long deliveryId, String token) throws Exception {
        Delivery delivery = deliveryService.retrieveDeliveryById(deliveryId);
        Offer offer = delivery.getOffer();
        if(offer == null) {
            throw new Exception("Delivery offer does not exist");
        }
        Order2 order = delivery.getOrder();
        if(order == null) {
            throw new Exception("Order does not exist");
        }

        PaymentIntent paymentIntent = PaymentIntent.retrieve(offer.getPaymentIntentId());
        Transaction transaction = offer.getTransactions().get(offer.getTransactions().size() - 1); //retrieve latest transaction

        System.out.println("Transaction fetched: " + transaction.getId());

        if (paymentIntent.getStatus().equalsIgnoreCase("requires_capture")) {

        transaction = transactionService.acceptDeliveryTransaction(transaction.getId(), deliveryId, order.getId(), token);

        System.out.println("Accepted Delivery: " + deliveryId);

            order = transaction.getOrder2();
            if (order != null) {
                log.info("payment intent capture running");
                PaymentIntent updatedPaymentIntent = paymentIntent.capture();
            }
            return transaction;
        } else {
            offer.setOfferStatus(OfferStatus.PENDING_PAYMENT);
            transactionService.rejectTransaction(transaction.getId());

            paymentIntent.setStatus("requires_payment_method");
            Transaction t = new Transaction();
            t.setOfferId(offer.getId());
            t.setAmount(offer.getPrice());
            t.setDateCreated(Calendar.getInstance().getTime());
            t.setPaymentStatus(PaymentStatus.PENDING);
            t.setPaymentIntentId(paymentIntent.getId());
            transactionService.createTransaction(offer.getId(), t);
            return t;
        }
    }

    @Override
    public void declinePayment(Long offerId) throws Exception {
        Offer offer = offerService.retrieveOfferById(offerId);
        Transaction transaction = offer.getTransactions().get(offer.getTransactions().size() - 1);
        transactionService.rejectTransaction(transaction.getId());
    }

    @Override
    public SetupIntent createSetupIntent() throws StripeException {
        List<Object> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("payment_method_types", paymentMethodTypes);
        SetupIntent setupIntent = SetupIntent.create(params);

        return setupIntent;
    }

    @Override
    public void saveCard(String id) throws StripeException {
        String customerId = appUserService.getUser(userService.getCurrentUsername()).getCustomerId();
        SetupIntent intent = SetupIntent.retrieve(id);
        PaymentMethod paymentMethod = PaymentMethod.retrieve(intent.getPaymentMethod());
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("customer", customerId);
        paymentMethod.attach(params);
    }

    @Override
    public PaymentMethodCollection getCards() throws StripeException {

        String customerId = appUserService.getUser(userService.getCurrentUsername()).getCustomerId();
        Customer customer = Customer.retrieve(customerId);
        CustomerListPaymentMethodsParams params2 =
                CustomerListPaymentMethodsParams.builder()
                        .setType(CustomerListPaymentMethodsParams.Type.CARD)
                        .build();

        PaymentMethodCollection paymentMethods = customer.listPaymentMethods(params2);

        return paymentMethods;
    }

    @Override
    public void removeCard(String pmId) throws StripeException {
        PaymentMethod paymentMethod = PaymentMethod.retrieve(pmId);
//        PaymentMethod updatedPaymentMethod = paymentMethod.detach();
        paymentMethod.detach();
//        return updatedPaymentMethod;
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException, OfferNotFoundException, CreditCardNotFoundException, NoAccessRightsException {

        String customerId = appUserService.getUser(userService.getCurrentUsername()).getCustomerId();
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Offer offer = offerService.retrieveOfferById(paymentInfo.getOfferId());
        offer.setOfferStatus(OfferStatus.PENDING_PAYMENT);

        if (offer.getPaymentIntentId() != null) {
            PaymentIntent pi = PaymentIntent.retrieve(offer.getPaymentIntentId());
            if(!pi.getStatus().equalsIgnoreCase("canceled")) {
                return pi;
            }
        }

        Map<String, Object> params = new HashMap<>();
        Double price = offer.getPrice() * 100;
        params.put("amount", price.intValue());
        params.put("capture_method", "manual");
        params.put("currency", "sgd");
        params.put("payment_method_types", paymentMethodTypes);
        params.put("customer", customerId);

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        offer.setPaymentIntentId(paymentIntent.getId());

        // create transaction
        Transaction transaction = new Transaction();
        transaction.setOfferId(paymentInfo.getOfferId());
        transaction.setAmount(offer.getPrice());
        transaction.setDateCreated(new Date());
        transaction.setPaymentStatus(PaymentStatus.PENDING);
        transaction.setPaymentIntentId(paymentIntent.getId());
        transactionService.createTransaction(paymentInfo.getOfferId(), transaction);

        return paymentIntent;
    }

    @Override
    public Refund createRefund(Long disputeId) throws Exception {
        Optional<Dispute> d = disputeRepo.findById(disputeId);
        Dispute dispute = d.get();
        if (dispute.getDisputeStatus().equals(DisputeStatus.DISPUTE_REQUEST_ACCEPTED)) {
            Order2 order = order2Service.retrieveOrderById(dispute.getOrderId());
            Offer offer = offerService.retrieveOfferById(order.getOfferId());

            Double amtCents = dispute.getRefundAmount() * 100;
            PaymentIntent paymentIntent = PaymentIntent.retrieve(offer.getPaymentIntentId());
            Refund refund = null;

            if (!paymentIntent.getStatus().equalsIgnoreCase("requires_capture")) {
                Map<String, Object> params = new HashMap<>();
                params.put("payment_intent", paymentIntent.getId());
                params.put("amount", amtCents.intValue());
                refund = Refund.create(params);
                dispute.setRefundId(refund.getId());
            } else {
                PaymentIntent updatedPaymentIntent = paymentIntent.cancel();
            }
            order.setOrderStatus(OrderStatus.CANCELLED);
            return refund;
        } else {
            throw new NoAccessRightsException("Refund has not been agreed by user.");
        }
    }

    @Override
    public Balance retrieveBalance() throws StripeException {
       return Balance.retrieve();
    }
}

