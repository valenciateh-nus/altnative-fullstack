package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.UserAlreadyEnabledError;
import com.altnative.Alt.Native.Exceptions.VerificationTokenNotFoundException;
import com.altnative.Alt.Native.Service.VerificationTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;

@RestController
@RequestMapping("/api/v1/token")
@RequiredArgsConstructor
@Slf4j
public class VerificationController {
    private final VerificationTokenService verificationTokenService;

    @GetMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestParam("token") String token) throws VerificationTokenNotFoundException, UserAlreadyEnabledError {
        try {
            return ResponseEntity.ok().body(verificationTokenService.confirmToken(token));
        } catch (UserAlreadyEnabledError | VerificationTokenNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/getNewToken")
    public ResponseEntity<?> getNewToken(@RequestParam Long userId) {
        try {
            verificationTokenService.generateNewToken(userId);
            return ResponseEntity.ok().body("New token has been generated");
        } catch (MessagingException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
