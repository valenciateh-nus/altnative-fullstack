package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.PasswordTokenInvalidException;
import com.altnative.Alt.Native.Exceptions.PasswordTokenNotFoundException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.PasswordToken;
import com.amazonaws.services.directory.model.UserDoesNotExistException;

import javax.mail.MessagingException;
import java.util.Optional;

public interface PasswordVerificationService {
    Optional<PasswordToken> getToken(String token);

    void generateNewPasswordToken(String username) throws UserDoesNotExistException, MessagingException;

    Boolean confirmToken(String token) throws PasswordTokenNotFoundException;

    AppUser changePassword(String token, String newPassword) throws PasswordTokenNotFoundException, PasswordTokenInvalidException;
}
