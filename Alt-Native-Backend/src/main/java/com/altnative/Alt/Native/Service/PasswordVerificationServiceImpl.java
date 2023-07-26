package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.PasswordTokenInvalidException;
import com.altnative.Alt.Native.Exceptions.PasswordTokenNotFoundException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.PasswordToken;
import com.altnative.Alt.Native.Repository.PasswordTokenRepo;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PasswordVerificationServiceImpl implements PasswordVerificationService {
    private final PasswordTokenRepo passwordTokenRepo;
    private final AppUserService appUserService;
    private final EmailSender emailSender;

    @Override
    public Optional<PasswordToken> getToken(String token) {
        return passwordTokenRepo.findByToken(token);
    }

    @Override
    public void generateNewPasswordToken(String username) throws UserDoesNotExistException, MessagingException {
        AppUser user = appUserService.getUser(username);

        System.out.println("App User retrieved with id: " + user.getId());

        String token = UUID.randomUUID().toString();
        PasswordToken passwordToken = new PasswordToken(token, LocalDateTime.now(), LocalDateTime.now().plusMinutes(15), user);

        passwordToken.setAppUser(user);
        passwordTokenRepo.save(passwordToken);
        String link = "http://localhost:8080/api/v1/token/confirmPasswordToken?token=" + token;
        String content = emailSender.buildForgetPasswordEmail(user.getName(), link);

        emailSender.sendCustomEmail(
                user.getUsername(), "Reset your password now!",content);
//        return verificationToken.getToken();
    }


    @Override
    public Boolean confirmToken(String token) throws PasswordTokenNotFoundException {
        Optional<PasswordToken> passwordTokenOptional = getToken(token);
        if (passwordTokenOptional.isEmpty()) {
            throw new PasswordTokenNotFoundException("Password token: " + token + " not found!");
        } else {
            PasswordToken passwordToken = passwordTokenOptional.get();

            LocalDateTime expiredAt = passwordToken.getExpiresAt();
            if (expiredAt.isBefore(LocalDateTime.now())) {
                throw new IllegalStateException("Token has expired already.");
            }

            return Boolean.TRUE;
        }
    }

    @Override
    public AppUser changePassword(String token, String newPassword) throws PasswordTokenNotFoundException, PasswordTokenInvalidException {
        Optional<PasswordToken> passwordTokenOptional = getToken(token);
        Boolean check = confirmToken(token);
        if (check) {
            if (passwordTokenOptional.isEmpty()) {
                throw new PasswordTokenNotFoundException("Password token: " + token + " not found!");
            } else {
                PasswordToken passwordToken = passwordTokenOptional.get();
                AppUser appUser = passwordToken.getAppUser();
                return appUserService.editPasswordDirectly(appUser.getUsername(), newPassword);
            }
        } else {
            throw new PasswordTokenInvalidException("Password token is not valid, please request for a new one.");
        }
    }
}
