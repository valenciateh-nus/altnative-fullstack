package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.OrderStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.WalletStatus;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.OrderNotFoundException;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.Order2Repo;
import com.altnative.Alt.Native.Repository.WalletRepo;
import com.altnative.Alt.Native.Repository.WalletTransactionRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class WalletServiceImpl implements WalletService {

    private final WalletTransactionRepo walletTransactionRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final Order2Repo order2Repo;
    private final WalletRepo walletRepo;


    private Wallet getWallet() {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Wallet wallet = user.getWallet();

        return wallet;
    }

    @Override
    public List<WalletTransaction> getTransaction(Integer pg) {
        Wallet wallet = getWallet();
        Pageable page = PageRequest.of(pg,10, Sort.by(Sort.Direction.DESC, "dateCompleted"));
        return walletTransactionRepo.findByWalletId(wallet.getId(),page);
    }

    @Override
    public void deposit(Long walletTransactionId) throws Exception {
        Wallet wallet = getWallet();
        Optional<WalletTransaction> wt = walletTransactionRepo.findById(walletTransactionId);
        if(wt.isPresent()) {
            WalletTransaction walletTransaction = wt.get();
            if(walletTransaction.getPaymentStatus().equals(WalletStatus.DEPOSIT_PENDING)) {
                wallet.setBalance(wallet.getBalance() + walletTransaction.getAmount());
                walletTransaction.setPaymentStatus(WalletStatus.DEPOSITTED);
            } else {
                throw new Exception("Wallet transaction already completed");
            }

        } else {
            throw new Exception("Invalid wallet transaction ID");
        }

    }

    @Override
    public void withdrawRequest(Double amount) throws Exception {
        AppUser user = appUserService.getUser(userService.getCurrentUsername());
        Wallet wallet = user.getWallet();
        if(wallet.getBalance() - amount >= 0) {
            WalletTransaction walletTransaction = new WalletTransaction();
            walletTransaction.setPaymentStatus(WalletStatus.WITHDRAW_PENDING);
            walletTransaction.setAmount(amount);
            walletTransaction.setWallet(wallet);
            walletTransaction.setDateCreated(new Date());
            walletTransaction.setDateCompleted(new Date());

            Double newBalance = (double) Math.round(((wallet.getBalance() - amount)) * 100)/100.0;
            Double newOnHoldBalance = (double) Math.round(((wallet.getOnHoldBalanace() + amount)) * 100)/100.0;
            wallet.setBalance(newBalance);
            wallet.setOnHoldBalanace(newOnHoldBalance);
            walletTransactionRepo.save(walletTransaction);
            wallet.getWalletTransactionList().add(walletTransaction);
            walletRepo.saveAndFlush(wallet);

        } else {
            throw new Exception("Insufficient funds");
        }

    }

    @Override
    public void approveWithdraw(Long id, String transactionId) throws Exception {
        User user = userService.getUser(userService.getCurrentUsername());
        if(user.getRoles().contains(Role.ADMIN)) {
            Optional<WalletTransaction> wt = walletTransactionRepo.findById(id);
            if(wt.isPresent()) {
                WalletTransaction walletTransaction = wt.get();
                if(walletTransaction.getPaymentStatus().equals(WalletStatus.WITHDRAW_PENDING)) {
                    walletTransaction.setTransactionId(transactionId);
                    walletTransaction.setPaymentStatus(WalletStatus.WITHDRAWN);
                    walletTransaction.setDateCompleted(new Date());
                    Wallet wallet = walletTransaction.getWallet();
                    Double newOnHoldBalance = (double) Math.round(((wallet.getOnHoldBalanace() - walletTransaction.getAmount())) * 100)/100.0;
                    wallet.setOnHoldBalanace(newOnHoldBalance);
                    walletTransactionRepo.save(walletTransaction);
                    walletRepo.save(wallet);
                } else {
                    throw new Exception("Already withdrawn");
                }
            } else {
                throw new Exception("Invalid wallet transaction ID");
            }


        } else {
            throw new NoAccessRightsException("You do not have rights to this method");
        }
    }

    @Override
    public void rejectWithdraw(Long id, String remark) throws Exception {
        User user = userService.getUser(userService.getCurrentUsername());
        if(user.getRoles().contains(Role.ADMIN)) {
            Optional<WalletTransaction> wt = walletTransactionRepo.findById(id);
            if(wt.isPresent()) {
                WalletTransaction walletTransaction = wt.get();
                if(walletTransaction.getPaymentStatus().equals(WalletStatus.WITHDRAW_PENDING)) {
                    walletTransaction.setRemarks(remark);
                    walletTransaction.setPaymentStatus(WalletStatus.AWARDED);
                    walletTransaction.setDateCompleted(new Date());
                    Wallet wallet = walletTransaction.getWallet();
                    if(wallet.getOnHoldBalanace() - walletTransaction.getAmount() < 0) {
                        throw new Exception("Negative holding balance if awarded");
                    }
                    wallet.setOnHoldBalanace(wallet.getOnHoldBalanace() - walletTransaction.getAmount());
                    wallet.setBalance(wallet.getBalance() + walletTransaction.getAmount());
                    walletTransactionRepo.save(walletTransaction);
                    walletRepo.save(wallet);
                } else {
                    throw new Exception("Already withdrawn");
                }
            } else {
                throw new Exception("Invalid wallet transaction ID");
            }
        } else {
            throw new NoAccessRightsException("You do not have rights to this method");
        }
    }

    @Override
    public void award(Long orderId) throws OrderNotFoundException {
        Optional<Order2> o = order2Repo.findById(orderId);
        if(!o.isPresent()) {
            throw new OrderNotFoundException("Order does not exist");
        }
        Order2 order = o.get();
        String username = order.getRefashionerUsername();

        if(username == null || username.isEmpty() ) {
            username = order.getBuyerUsername();
        }
        AppUser user = appUserService.getUser(username);
        Wallet wallet = user.getWallet();
        if(order.getOrderStatus().equals(OrderStatus.PRODUCT_COMPLETED)) {
            WalletTransaction walletTransaction = new WalletTransaction();
            WalletTransaction fees = new WalletTransaction();

            Double fee = (double) Math.round((order.getOrderPrice() * 0.1) * 100)/100.0;
            Double remainder = order.getOrderPrice() - fee;

            fees.setPaymentStatus(WalletStatus.PLATFORM_FEES);
            fees.setWallet(wallet);
            fees.setAmount(fee);
            fees.setDateCreated(new Date());
            fees.setDateCompleted(new Date());
            walletTransactionRepo.save(fees);
            wallet.getWalletTransactionList().add(fees);

            walletTransaction.setPaymentStatus(WalletStatus.AWARDED);
            walletTransaction.setAmount(remainder);
            walletTransaction.setWallet(wallet);
            walletTransaction.setDateCreated(new Date());

            wallet.setBalance(wallet.getBalance() + walletTransaction.getAmount());
            order.setOrderStatus(OrderStatus.COMPLETED);

            walletTransaction.setDateCompleted(new Date());
            walletTransactionRepo.save(walletTransaction);
            wallet.getWalletTransactionList().add(walletTransaction);
            walletRepo.save(wallet);
        }
    }

}
