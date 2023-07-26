package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.PaymentStatus;
import com.altnative.Alt.Native.Model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface TransactionRepo extends JpaRepository<Transaction, Long> {

    List<Transaction> findByPaymentStatusIn(List<PaymentStatus> statuses);

    List<Transaction> findAllByDateCompletedBetweenAndPaymentStatusIn(
            Date timeStart,
            Date timeEnd, List<PaymentStatus> statuses);

}