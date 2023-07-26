package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Service.EmailSender;
import com.altnative.Alt.Native.Service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.IOException;

@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
@Slf4j
public class EmailController {
    private final EmailSender emailSender;

    @PostMapping("/sendEmail")
    public ResponseEntity<?> sendEmail(@RequestParam String email) {
        try {
//            emailSender.testSend("seahshilin@gmail.com", "Testing email");
            emailSender.sendmail2(email);
            return ResponseEntity.ok().body("Email sent successfully!");
        } catch (MessagingException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/sendCustomMail")
    public ResponseEntity<?> sendCustomMail(@RequestPart String recipient, @RequestPart String subject, @RequestPart String content) {
        try {
            emailSender.sendCustomEmail(recipient, subject, content);
            return ResponseEntity.ok().body("Email sent successfully!");
        } catch (MessagingException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }
}
