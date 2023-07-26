package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Transaction;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TransactionService {
    Transaction createTransaction(Long offerId, Transaction transaction) throws CreditCardNotFoundException, OfferNotFoundException;

    Transaction acceptEventTransaction(Long transactionId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException;

    Transaction acceptSwapRequestTransaction(Long transactionId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException;
    // public List<Transaction> retrieveTransactionsByCreditCardId(Long creditCardId) throws CreditCardNotFoundException, NoAccessRightsException;

    List<Transaction> retrieveTransactionsByOfferId(Long offerId) throws OfferNotFoundException, NoAccessRightsException;

    List<Transaction> retrieveAllTransactions();

    List<Transaction> retrieveTransactionsByStatus(List<String> statuses) throws NoAccessRightsException;

    Transaction retrieveTransactionById(Long id) throws TransactionNotFoundException, NoAccessRightsException;

    String deleteTransaction(Long id) throws TransactionNotFoundException, NoAccessRightsException;

    Transaction rejectTransaction(Long transactionId) throws TransactionNotFoundException, TransactionAlreadyCompletedException, NoAccessRightsException;

    Transaction holdTransaction(Long transactionId) throws TransactionNotFoundException, TransactionAlreadyCompletedException, NoAccessRightsException;

    Transaction acceptMPLTransaction(Long transactionId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, ChatNotFoundException;

    Transaction acceptSwapOutTransaction(Long transactionId, Long orderId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, OrderNotFoundException;

    Transaction acceptTransaction(Long transactionId) throws Exception;

//    Transaction acceptAddOnTransaction(Long transactionId, Long addOnId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, OfferNotFoundException, OrderNotFoundException, AddOnNotFoundException;

    Transaction acceptAddOnTransaction(Long transactionId, Long orderId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, OfferNotFoundException, OrderNotFoundException, AddOnNotFoundException;

    Transaction acceptDeliveryTransaction(Long transactionId, Long deliveryId, Long orderId, String token) throws DeliveryNotFoundException, NoAccessRightsException, TransactionNotFoundException, OrderNotFoundException, TransactionAlreadyCompletedException, JNTDeliveryCreationError;

//    Transaction acceptMPLTransaction(Long transactionId) throws TransactionNotFoundException, NoAccessRightsException, TransactionAlreadyCompletedException, ChatNotFoundException;
}
