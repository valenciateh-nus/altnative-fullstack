package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.BankAccountDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BankAccountDetailsService {
    BankAccountDetails createBankAccountDetails(BankAccountDetails bad, MultipartFile file) throws InvalidFileException, S3Exception;

    public BankAccountDetails retrieveBankAccountDetailsByNumber(String bankAccountNo) throws BankAccountDetailsNotFoundException, NoAccessRightsException;
    public List<BankAccountDetails> retrieveAllBankAccountDetails() throws NoAccessRightsException;
    public BankAccountDetails retrieveBankAccountDetailsById(Long id) throws BankAccountDetailsNotFoundException, NoAccessRightsException;

    List<BankAccountDetails> retrieveAllUnverifiedBankAccountDetails() throws NoAccessRightsException;

    void verifyBankAccount(Long id) throws BankAccountDetailsNotFoundException, NoAccessRightsException;

    void rejectBankAccount(Long id,String rejectionReason) throws BankAccountDetailsNotFoundException, NoAccessRightsException;

    public void deleteBankAccountDetail(Long id) throws BankAccountDetailsNotFoundException, NoAccessRightsException;
}
