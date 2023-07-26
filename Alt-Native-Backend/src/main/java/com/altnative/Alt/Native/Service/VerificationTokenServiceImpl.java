package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.UserAlreadyEnabledError;
import com.altnative.Alt.Native.Exceptions.VerificationTokenNotFoundException;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.VerificationToken;
import com.altnative.Alt.Native.Repository.VerificationTokenRepo;
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
public class VerificationTokenServiceImpl implements VerificationTokenService {
    private final VerificationTokenRepo verificationTokenRepo;
    private final AppUserService appUserService;
    private final UserService userService;
    private final EmailSender emailSender;

    @Override
    public void saveVerificationToken(VerificationToken verificationToken) {
        verificationTokenRepo.save(verificationToken);
    }

    @Override
    public Optional<VerificationToken> getToken(String token) {
        return verificationTokenRepo.findByToken(token);
    }

    @Override
    public int setConfirmedAt(String token) {
        return verificationTokenRepo.updateConfirmedAt(
                token, LocalDateTime.now());
    }

    @Override
    public void generateNewToken(Long userId) throws UserDoesNotExistException, MessagingException {
        AppUser newUser = appUserService.getUserById(userId);

        System.out.println("App User retrieved with id: " + newUser.getId());

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(
                token, LocalDateTime.now(), LocalDateTime.now().plusMinutes(15),newUser
        );
        verificationToken.setAppUser(newUser);
        verificationTokenRepo.save(verificationToken);
        String link = "http://localhost:8080/api/v1/token/confirm?token=" + token;
        String content = emailSender.buildEmail(newUser.getName(), link);

        emailSender.sendmail(
                newUser.getUsername(), content);
//        return verificationToken.getToken();
    }

    @Transactional
    @Override
    public String confirmToken(String token) throws VerificationTokenNotFoundException, UserAlreadyEnabledError{
        Optional<VerificationToken> verificationTokenOptional = getToken(token);
        if (verificationTokenOptional.isEmpty()) {
            throw new VerificationTokenNotFoundException("Verification token: " + token + " not found!");
        } else {
            VerificationToken verificationToken = verificationTokenOptional.get();
            if (verificationToken.getAppUser().getEnabled().equals(Boolean.TRUE)) {
                throw new UserAlreadyEnabledError("User has already been enabled, please login.");
            }

            if (verificationToken.getConfirmedAt() != null) {
                throw new IllegalStateException("Email already confirmed.");
            }
            LocalDateTime expiredAt = verificationToken.getExpiresAt();
            if (expiredAt.isBefore(LocalDateTime.now())) {
                throw new IllegalStateException("Token has expired already.");
            }
            this.setConfirmedAt(token);
            appUserService.enableAppUser(
                    verificationToken.getAppUser().getUsername());
            return "User has been confirmed successfully";
        }
    }
}
