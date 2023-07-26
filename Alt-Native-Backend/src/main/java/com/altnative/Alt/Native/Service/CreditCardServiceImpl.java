//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Enum.Role;
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Model.AppUser;
//import com.altnative.Alt.Native.Model.CreditCard;
//import com.altnative.Alt.Native.Model.Material;
//import com.altnative.Alt.Native.Repository.AppUserRepo;
//import com.altnative.Alt.Native.Repository.CreditCardRepo;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import javax.transaction.Transactional;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//@Slf4j
//public class CreditCardServiceImpl implements CreditCardService {
//
//    private final CreditCardRepo creditCardRepo;
//    private final AppUserService appUserService;
//    private final AppUserRepo appUserRepo;
//    private final UserService userService;
//
//    @Override
//    public CreditCard createCreditCard(CreditCard creditCardInformation) {
//
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//        List<CreditCard> currentCreditCards = currUser.getCreditCards();
//
//        try {
//            CreditCard cc = retrieveCreditCardByCardNumber(creditCardInformation.getCardNumber());
//            creditCardInformation = cc;
//        } catch (CreditCardNotFoundException | NoAccessRightsException ex) {
//            // not found
//            creditCardRepo.save(creditCardInformation);
//        }
//        if (!currentCreditCards.contains(creditCardInformation)) {
//            currentCreditCards.add(creditCardInformation);
//            appUserRepo.save(currUser);
//        }
//        return creditCardInformation;
//    }
//
//    @Override
//    public CreditCard retrieveCreditCardByCardNumber(String cardNumber) throws CreditCardNotFoundException, NoAccessRightsException {
//        CreditCard creditCard = creditCardRepo.findByCardNumber(cardNumber);
//        if (creditCard != null) {
//            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//            if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getCreditCards().contains(creditCard)) {
//                return creditCard;
//            }
//            throw new NoAccessRightsException("You do not have the access rights to do this method!");
//        } else {
//            throw new CreditCardNotFoundException("Credit Card Information with card number " + cardNumber + " does not exist.");
//        }
//    }
//
//    @Override
//    public List<CreditCard> retrieveAllCreditCards() {
//        return creditCardRepo.findAll();
//    }
//
//    @Override
//    public CreditCard retrieveCreditCardById(Long id) throws CreditCardNotFoundException, NoAccessRightsException {
//        Optional<CreditCard> creditCard = creditCardRepo.findById(id);
//        if (creditCard.isEmpty()) {
//            throw new CreditCardNotFoundException("Credit Card with ID " + id + " does not exist.");
//        } else {
//            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//            if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getCreditCards().contains(creditCard.get())) {
//                return creditCard.get();
//            }
//            throw new NoAccessRightsException("You do not have the access rights to do this method!");
//        }
//    }
//
//    @Override
//    public String deleteCreditCard(Long id) throws CreditCardNotFoundException, NoAccessRightsException {
//        CreditCard creditCard = retrieveCreditCardById(id);
//        if (creditCard == null) {
//            throw new CreditCardNotFoundException("Credit Card Information with ID " + id + " does not exist.");
//        }
//        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getCreditCards().contains(creditCard)) {
//            creditCardRepo.deleteById(id);
//            return "Credit Card Information with ID " + id + " deleted successfully.";
//        }
//        throw new NoAccessRightsException("You do not have the access rights to do this method!");
//    }
//
//    @Override
//    public CreditCard updateCreditCard(CreditCard newCreditCard) throws CreditCardNotFoundException, NoAccessRightsException {
//        Optional<CreditCard> creditCardOptional = creditCardRepo.findById(newCreditCard.getId());
//        if (creditCardOptional.isEmpty()) {
//            throw new CreditCardNotFoundException("Credit card with ID: " + newCreditCard.getId() + " not found.");
//        } else {
//            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
//            if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getCreditCards().contains(creditCardOptional.get())) {
//                CreditCard creditCard = creditCardOptional.get();
//                creditCard.setCardHolderName(newCreditCard.getCardHolderName());
//                creditCard.setExpiryDate(newCreditCard.getExpiryDate());
//
//                //Edit the old credit card to the new one
//                List<CreditCard> userCreditCards = currUser.getCreditCards();
//                for (CreditCard card : userCreditCards) {
//                    if (card.getId() == newCreditCard.getId()) {
//                        card.setCardHolderName(newCreditCard.getCardHolderName());
//                        card.setExpiryDate(newCreditCard.getExpiryDate());
//                    }
//                }
//                currUser.setCreditCards(userCreditCards);
//                appUserRepo.save(currUser);
//                creditCardRepo.save(creditCard);
//                return creditCard;
//            }
//            throw new NoAccessRightsException("You do not have the access rights to do this method!");
//        }
//    }
//
//}
