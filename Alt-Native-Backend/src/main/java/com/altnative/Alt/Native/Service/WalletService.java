package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.InvalidOrderException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.OrderNotFoundException;
import com.altnative.Alt.Native.Model.Order2;
import com.altnative.Alt.Native.Model.WalletTransaction;

import java.util.List;

public interface WalletService {
    List<WalletTransaction> getTransaction(Integer pg);

    void deposit(Long walletTransactionId) throws Exception;

    void withdrawRequest(Double amount) throws Exception;

    void approveWithdraw(Long id, String transactionId) throws Exception;

    void rejectWithdraw(Long id, String remark) throws Exception;

    void award(Long orderId) throws OrderNotFoundException;
}
