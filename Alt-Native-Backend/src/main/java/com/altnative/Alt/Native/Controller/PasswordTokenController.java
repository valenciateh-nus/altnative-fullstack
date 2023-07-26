package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.PasswordTokenInvalidException;
import com.altnative.Alt.Native.Exceptions.PasswordTokenNotFoundException;
import com.altnative.Alt.Native.Exceptions.UserAlreadyEnabledError;
import com.altnative.Alt.Native.Exceptions.VerificationTokenNotFoundException;
import com.altnative.Alt.Native.Service.PasswordVerificationService;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
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
public class PasswordTokenController {
    private final PasswordVerificationService passwordVerificationService;

    @GetMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestParam String username){
        try {
            passwordVerificationService.generateNewPasswordToken(username);
            return ResponseEntity.ok().body("Reset link has been sent to your mail! Check your inbox!");
        } catch (MessagingException | UserDoesNotExistException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/confirmPasswordToken")
    public ResponseEntity<?> confirmToken(@RequestParam String token) {
        try {
            return ResponseEntity.ok().body(passwordVerificationService.confirmToken(token));
        } catch (PasswordTokenNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestParam String token, @RequestBody String newPassword) {
        try {
            return ResponseEntity.ok().body(passwordVerificationService.changePassword(token, newPassword));
        } catch (PasswordTokenNotFoundException | PasswordTokenInvalidException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
