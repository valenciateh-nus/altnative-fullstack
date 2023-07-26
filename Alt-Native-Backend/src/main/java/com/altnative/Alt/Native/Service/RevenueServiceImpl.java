package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DateDto;
import com.altnative.Alt.Native.Enum.OfferStatus;
import com.altnative.Alt.Native.Enum.PaymentStatus;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.AppUserRepo;
import com.altnative.Alt.Native.Repository.OfferRepo;
import com.altnative.Alt.Native.Repository.ReviewRepo;
import com.altnative.Alt.Native.Repository.TransactionRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RevenueServiceImpl implements RevenueService {
    private final TransactionRepo transactionRepo;
    private final DisputeService disputeService;
    private final AppUserService appUserService;
    private final UserService userService;
    private final OfferRepo offerRepo;

    @Override
    public Double retrieveRevenueByDate(DateDto dates) {
        LocalDate startDate = LocalDate.parse(dates.getStart());
        LocalDate endDate = LocalDate.parse(dates.getEnd());
        endDate = endDate.plusDays(1);
        Date startDate1 = java.sql.Date.valueOf(startDate);
        Date endDate1 = java.sql.Date.valueOf(endDate);
        Double revenue = 0.0;
        List<PaymentStatus> ps = new ArrayList<>();
        ps.add(PaymentStatus.COMPLETED);
        List<Transaction> transactions = transactionRepo.findAllByDateCompletedBetweenAndPaymentStatusIn(startDate1, endDate1, ps);
        for (Transaction t : transactions) {
            revenue += t.getAmount();
        }
        Double refund = disputeService.retrieveRefundsByDate(dates);
        Double netRev = revenue - refund;
        return netRev * 0.15;
    }

    @Override
    public Double retrieveRefashionerRevenueByDate() {
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DAY_OF_MONTH, -30);
        Date endDate = new Date();
        Date startDate = c.getTime();

        List<PaymentStatus> ps = new ArrayList<>();
        ps.add(PaymentStatus.COMPLETED);
        List<Transaction> transactions = transactionRepo.findAllByDateCompletedBetweenAndPaymentStatusIn(startDate, endDate, ps);

//        System.out.println("offers1 are" + offers.size());
//        List<Offer> offers1 = offerRepo.findByAppUserUsernameAndOfferStatusInAndDateOfAcceptanceBetween(userService.getCurrentUsername(), os, startDate, endDate);
//        System.out.println("offers2 are" + offers1);
//        List<Offer> offers2 = offerRepo.findByDateOfAcceptanceBetweenAndOfferStatusInAndAppUserUsername(startDate, endDate, os, userService.getCurrentUsername());
        Double revenue = 0.0;
        for (Transaction t : transactions) {
            // retrieve latest transaction
            Offer offer = offerRepo.getById(t.getOfferId());
            if (offer.getAppUser().getUsername().equals(userService.getCurrentUsername())) {
                revenue += t.getAmount();
            }
        }
        Double refund = disputeService.retrieveRefundsByRefashionerAndDate();
        Double netRev = revenue - refund;
        return netRev * 0.85;
    }
}
