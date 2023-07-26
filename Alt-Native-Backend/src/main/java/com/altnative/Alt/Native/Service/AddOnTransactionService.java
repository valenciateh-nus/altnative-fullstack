//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Exceptions.InvalidAddOnTransactionException;
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Model.AddOnTransaction;
//
//import java.util.List;
//
//public interface AddOnTransactionService {
//
//    AddOnTransaction createAddOnTransaction(Long addOnId, AddOnTransaction addOnTransaction) throws InvalidAddOnTransactionException, CreditCardNotFoundException, AddOnNotFoundException, OfferNotFoundException, NoAccessRightsException;
//
////    public List<AddOnTransaction> retrieveAddOnTransactionsByCreditCardId(Long creditCardId) throws CreditCardNotFoundException, OfferNotFoundException, NoAccessRightsException;
//
//    public List<AddOnTransaction> retrieveAddOnTransactionsByAddOnId(Long addOnId) throws AddOnNotFoundException, OfferNotFoundException, NoAccessRightsException;
//
//    public List<AddOnTransaction> retrieveAllAddOnTransactions();
//
//    public AddOnTransaction retrieveAddOnTransactionById(Long id) throws AddOnTransactionNotFoundException, OfferNotFoundException, NoAccessRightsException;
//
//    public String deleteAddOnTransaction(Long id) throws AddOnTransactionNotFoundException, NoAccessRightsException, OfferNotFoundException;
//
//    public AddOnTransaction rejectAddOnTransaction(Long addOnTransactionId) throws AddOnTransactionNotFoundException, AddOnTransactionAlreadyCompletedException, NoAccessRightsException, OfferNotFoundException;
//
//    public AddOnTransaction holdAddOnTransaction(Long addOnTransactionId) throws AddOnTransactionNotFoundException, AddOnTransactionAlreadyCompletedException, NoAccessRightsException, OfferNotFoundException;
//
//    public AddOnTransaction acceptAddOnTransaction(Long addOnTransactionId) throws AddOnTransactionNotFoundException, AddOnTransactionAlreadyCompletedException, NoAccessRightsException, OfferNotFoundException;
//
//}