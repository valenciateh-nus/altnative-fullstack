package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.DisputeStatus;
import com.altnative.Alt.Native.Enum.PaymentStatus;
import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Model.Dispute;
import com.altnative.Alt.Native.Model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface DisputeRepo extends JpaRepository<Dispute, Long> {

    @Query("SELECT d FROM Dispute d JOIN d.appUser a WHERE a.id = (:userId)")
    List<Dispute> findAllDisputesByUserId(Long userId);

    List<Dispute> findByDisputeStatusIn(List<DisputeStatus> statuses);



    List<Dispute> findAllByDateCompletedBetweenAndDisputeStatusIn(
            Date timeStart,
            Date timeEnd, List<DisputeStatus> statuses);

    List<Dispute> findByRefashionerUsernameAndDateCompletedBetweenAndDisputeStatusIn(String username,
                                                                                     Date timeStart,
                                                                                     Date timeEnd, List<DisputeStatus> statuses);

    List<Dispute> findBySellerUsernameAndDateCompletedBetweenAndDisputeStatusIn(String username,
                                                                                Date timeStart,
                                                                                Date timeEnd, List<DisputeStatus> statuses);

}
