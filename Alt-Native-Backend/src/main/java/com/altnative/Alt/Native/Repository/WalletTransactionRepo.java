package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.WalletStatus;
import com.altnative.Alt.Native.Model.Milestone;
import com.altnative.Alt.Native.Model.ProjectListing;
import com.altnative.Alt.Native.Model.WalletTransaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepo extends JpaRepository<WalletTransaction, Long> {

    WalletTransaction findByPaymentIntentId(String paymentIntentId);

    @Query("SELECT wt FROM WalletTransaction wt JOIN wt.wallet w WHERE w.id = (:walletId)")
    List<WalletTransaction> findByWalletId(Long walletId, Pageable pageable);

    List<WalletTransaction> findByPaymentStatusIn(List<WalletStatus> walletStatuses);
    
}
