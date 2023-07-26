package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.BankAccountDetails;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Repository.BankAccountDetailsRepo;
import com.altnative.Alt.Native.Repository.AppUserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BankAccountDetailsServiceImpl implements BankAccountDetailsService {
    private final BankAccountDetailsRepo bankAccountDetailsRepo;
    private final AppUserService appUserService;
    private final AppUserRepo appUserRepo;
    private final UserService userService;
    private final ImageService imageService;

    @Override
    public BankAccountDetails createBankAccountDetails(BankAccountDetails bad, MultipartFile file) throws InvalidFileException, S3Exception {
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), currUser.getId());
        String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());
        Image newImage = new Image();
        newImage.setPath(path);
        newImage.setFileName(filename);
        newImage = imageService.createImage(newImage, file);
        bad.setPrevBankStatement(newImage);
        bad.setAppUser(currUser);
        bad.setDateCreated(new Date());
        BankAccountDetails bad1 = bankAccountDetailsRepo.save(bad);

        currUser.setBankAccountDetails(bad1);
        appUserRepo.save(currUser);

        return bad1;
    }

    @Override
    public BankAccountDetails retrieveBankAccountDetailsByNumber(String bankAccountNo) throws BankAccountDetailsNotFoundException, NoAccessRightsException {
        BankAccountDetails exists = bankAccountDetailsRepo.findByBankAccountNo(bankAccountNo);
        if (exists!=null) {
            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
            BankAccountDetails currentUserBankAccountDetails = currUser.getBankAccountDetails();
            if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currentUserBankAccountDetails.equals(exists)) {
                return exists;
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        } else {
            throw new BankAccountDetailsNotFoundException(bankAccountNo + "does not exist.");
        }
    }

    @Override
    public BankAccountDetails retrieveBankAccountDetailsById(Long id) throws BankAccountDetailsNotFoundException, NoAccessRightsException {
        Optional<BankAccountDetails> exists = bankAccountDetailsRepo.findById(id);
        if (exists.isEmpty()) {
            throw new BankAccountDetailsNotFoundException("Bank id: " + id + " does not exist.");
        } else {
            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
            BankAccountDetails currentUserBankAccountDetails = currUser.getBankAccountDetails();
            if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currentUserBankAccountDetails.getId() == id) {
                return exists.get();
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public List<BankAccountDetails> retrieveAllBankAccountDetails() throws NoAccessRightsException {
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            return bankAccountDetailsRepo.findAll();
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public List<BankAccountDetails> retrieveAllUnverifiedBankAccountDetails() throws NoAccessRightsException {
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            return bankAccountDetailsRepo.findByVerifiedIsNull();
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public void verifyBankAccount(Long id) throws BankAccountDetailsNotFoundException, NoAccessRightsException {
        Optional<BankAccountDetails> exists = bankAccountDetailsRepo.findById(id);
        if (exists.isEmpty()) {
            throw new BankAccountDetailsNotFoundException("Bank id: " + id + " does not exist.");
        } else {
            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
            if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                BankAccountDetails bad = exists.get();
                bad.setVerified(true);
                bankAccountDetailsRepo.save(bad);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public void rejectBankAccount(Long id, String rejectionReason) throws BankAccountDetailsNotFoundException, NoAccessRightsException {
        Optional<BankAccountDetails> exists = bankAccountDetailsRepo.findById(id);
        if (exists.isEmpty()) {
            throw new BankAccountDetailsNotFoundException("Bank id: " + id + " does not exist.");
        } else {
            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
            if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                BankAccountDetails bad = exists.get();
                bad.setRemarks(rejectionReason);
                bad.setVerified(false);
                bankAccountDetailsRepo.save(bad);
            } else {
                throw new NoAccessRightsException("You do not have the access rights to do this method!");
            }
        }
    }

    @Override
    public void deleteBankAccountDetail(Long id) throws BankAccountDetailsNotFoundException, NoAccessRightsException {
        BankAccountDetails bad = retrieveBankAccountDetailsById(id);
        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        BankAccountDetails currUserBankAccountDetails = currUser.getBankAccountDetails();
        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUserBankAccountDetails.getId() == id || currUserBankAccountDetails.getId().equals(id)) {
            currUser.setBankAccountDetails(null);
            appUserRepo.save(currUser);
            bankAccountDetailsRepo.deleteById(id);
            bankAccountDetailsRepo.flush();
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }
}
