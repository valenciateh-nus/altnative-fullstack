package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.WalletStatus;
import com.altnative.Alt.Native.Exceptions.CreditCardNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.OfferNotFoundException;
import com.altnative.Alt.Native.Model.WalletTransaction;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.util.List;

public interface WalletTransactionService {

    List<WalletTransaction> searchWalletTransactionsByStatus(List<String> statuses) throws NoAccessRightsException;

    PaymentIntent createPaymentIntent(Double amount) throws StripeException, OfferNotFoundException, CreditCardNotFoundException, NoAccessRightsException;

    void completeWalletTransaction(String paymentIntentId) throws Exception;
}
