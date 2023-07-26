//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Exceptions.CreditCardNotFoundException;
//import com.altnative.Alt.Native.Exceptions.InvalidCreditCardException;
//import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
//import com.altnative.Alt.Native.Model.CreditCard;
//
//import java.util.List;
//
//public interface CreditCardService {
//
//    CreditCard createCreditCard(CreditCard CreditCardInformation);
//    public CreditCard retrieveCreditCardByCardNumber(String cardNumber) throws CreditCardNotFoundException, NoAccessRightsException;
//    public List<CreditCard> retrieveAllCreditCards();
//    public CreditCard retrieveCreditCardById(Long id) throws CreditCardNotFoundException, NoAccessRightsException;
//    public String deleteCreditCard(Long id) throws CreditCardNotFoundException, NoAccessRightsException;
//    public CreditCard updateCreditCard(CreditCard creditCard) throws CreditCardNotFoundException, NoAccessRightsException;
//}
