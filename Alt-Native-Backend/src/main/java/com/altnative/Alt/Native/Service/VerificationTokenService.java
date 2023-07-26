package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.UserAlreadyEnabledError;
import com.altnative.Alt.Native.Exceptions.VerificationTokenNotFoundException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.VerificationToken;
import com.amazonaws.services.directory.model.UserDoesNotExistException;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.util.Optional;

public interface VerificationTokenService {
    void saveVerificationToken(VerificationToken verificationToken);

    Optional<VerificationToken> getToken(String token);

    int setConfirmedAt(String token);

//    void generateNewToken(Long userId) throws Exception;

    void generateNewToken(Long userId) throws UserDoesNotExistException, MessagingException;

    @Transactional
    String confirmToken(String token) throws VerificationTokenNotFoundException, UserAlreadyEnabledError;

}
