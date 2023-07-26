package com.altnative.Alt.Native.Service;

import org.springframework.scheduling.annotation.Async;

import javax.mail.MessagingException;

public interface EmailSender {

    void sendmail(String email, String content) throws MessagingException;

    void sendmail2(String email) throws MessagingException;

    @Async
    void sendCustomEmail(String recipient, String subject, String content) throws MessagingException;

    String buildEmail(String name, String link);

    String buildForgetPasswordEmail(String name, String link);
}
