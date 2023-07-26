package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.BankAccountDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankAccountDetailsRepo extends JpaRepository<BankAccountDetails, Long> {
    public BankAccountDetails findByBankAccountNo(String bankAccountNo);

    public List<BankAccountDetails> findByVerifiedTrue();
    public List<BankAccountDetails> findByVerifiedFalse();
    public List<BankAccountDetails> findByVerifiedIsNull();
}