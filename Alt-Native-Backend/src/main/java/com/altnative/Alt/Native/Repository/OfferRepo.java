package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.OfferStatus;
import com.altnative.Alt.Native.Enum.PaymentStatus;
import com.altnative.Alt.Native.Model.Offer;
import com.altnative.Alt.Native.Model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Date;
import java.util.List;

public interface OfferRepo extends JpaRepository<Offer, Long> {

    List<Offer> findByAppUserUsernameAndTitleContainingIgnoreCaseAndOfferStatusIn(String username, String title, List<OfferStatus> statuses);

    List<Offer> findByAppUserUsernameAndOfferStatusIn(String username, List<OfferStatus> statuses);

    List<Offer> findByAppUserUsernameAndOfferStatusInAndDateOfAcceptanceBetween(String username, List<OfferStatus> statuses, Date timeStart, Date timeEnd);

    List<Offer> findByDateOfAcceptanceBetweenAndOfferStatusInAndAppUserUsername(Date timeStart, Date timeEnd, List<OfferStatus> statuses, String username);

    List<Offer> findByDateOfAcceptanceBetween(Date timeStart, Date timeEnd);

    List<Offer> findByDateOfAcceptanceBetweenAndOfferStatusIn(Date timeStart, Date timeEnd, List<OfferStatus> statuses);

    List<Offer> findByRefashioneeUsernameAndTitleContainingIgnoreCase(String username, String title);

    List<Offer> findByOfferStatusInAndAppUserUsername(List<OfferStatus> statuses, String username);

    List<Offer> findByOfferStatusInAndAppUserUsernameAndTitleContainingIgnoreCase(List<OfferStatus> statuses, String username, String title);

    List<Offer> findByAppUserUsername(String username);

    List<Offer> findByProjectListingId(Long projectListingId);

    List<Offer> findByProjectRequestId(Long projectRequestId);
}