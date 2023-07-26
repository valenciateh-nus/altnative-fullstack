package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.WalletStatus;
import com.altnative.Alt.Native.Exceptions.CreditCardNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.OfferNotFoundException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.Wallet;
import com.altnative.Alt.Native.Model.WalletTransaction;
import com.altnative.Alt.Native.Repository.WalletTransactionRepo;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class WalletTransactionServiceImpl implements WalletTransactionService {

    private final AppUserService appUserService;
    private final UserService userService;
    private final Order2Service order2Service;
    private final WalletTransactionRepo walletTransactionRepo;
    private final WalletService walletService;

    @Override
    public List<WalletTransaction> searchWalletTransactionsByStatus(List<String> statuses) throws NoAccessRightsException {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        if (user.getRoles().contains(Role.valueOf("ADMIN"))) {
            if (statuses != null) {
                List<WalletStatus> ps = new ArrayList<>();
                if(statuses.size() == 0) {
                    return walletTransactionRepo.findAll();
                }
                for (String s : statuses) {
                    String upper = s.toUpperCase();
                    ps.add(WalletStatus.valueOf(upper));
                }
                List<WalletTransaction> transactions = walletTransactionRepo.findByPaymentStatusIn(ps);
                return transactions;
            } else {
                return walletTransactionRepo.findAll();
            }
        } else {
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public PaymentIntent createPaymentIntent(Double amount) throws StripeException, OfferNotFoundException, CreditCardNotFoundException, NoAccessRightsException {

        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        String customerId = user.getCustomerId();
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        Double price = amount * 100;
        params.put("amount", price.intValue());
        params.put("capture_method", "manual");
        params.put("currency", "sgd");
        params.put("payment_method_types", paymentMethodTypes);
        params.put("customer", customerId);

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // create transaction

        return paymentIntent;
    }

    @Override
    public void completeWalletTransaction(String paymentIntentId) throws Exception {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Wallet wallet = user.getWallet();
        if (paymentIntent.getStatus().equalsIgnoreCase("requires_capture")) {
            WalletTransaction walletTransaction = new WalletTransaction();
            walletTransaction.setPaymentIntentId(paymentIntent.getId());
            walletTransaction.setWallet(user.getWallet());
            walletTransaction.setAmount((double) (paymentIntent.getAmount()/100));
            walletTransaction.setPaymentStatus(WalletStatus.DEPOSIT_PENDING);
            walletTransactionRepo.save(walletTransaction);
            wallet.getWalletTransactionList().add(walletTransaction);
            PaymentIntent updatedPaymentIntent = paymentIntent.capture();
            walletTransaction.setDateCreated(new Date());
            walletService.deposit(walletTransaction.getId());

        }
    }
}
