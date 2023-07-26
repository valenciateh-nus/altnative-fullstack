package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.checkout.PaymentInfo;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Dispute;
import com.altnative.Alt.Native.Model.Offer;
import com.altnative.Alt.Native.Model.Order2;
import com.altnative.Alt.Native.Model.Transaction;
import com.stripe.exception.StripeException;
import com.stripe.model.*;

public interface CheckoutService {


    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException, OfferNotFoundException, CreditCardNotFoundException, NoAccessRightsException;

    public SetupIntent createSetupIntent() throws StripeException;

    public void saveCard(String setupIntentId) throws StripeException;

    //    public PaymentMethod removeCard(String pmId) throws StripeException;
    public void removeCard(String pmId) throws StripeException;

    public PaymentMethodCollection getCards() throws StripeException;

    Transaction placeOrder(Long offerId) throws Exception;

    Transaction placeAddOnOrder(Long addOnOfferId, Long orderId) throws Exception;

    Transaction placeDeliveryOrder(Long deliveryId, String token) throws Exception;

    void declinePayment(Long offerId) throws Exception;

    Refund createRefund(Long disputeId) throws Exception;

    Transaction placeSwapItemDeliveryOrder(Long offerId, Long orderId) throws Exception;

    Dispute processRefund(Long disputeId) throws Exception;

    Balance retrieveBalance() throws StripeException;
}
