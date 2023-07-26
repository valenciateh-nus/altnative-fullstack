package com.altnative.Alt.Native.Controller;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Service.Chat2Service;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Controller
public class ChatController {

    @Autowired
    Chat2Service chat2Service;

    @MessageMapping("/messages/{to}")
    public void sendPersonalMessage(@DestinationVariable String to, @RequestBody SendMessageForm sendMessageForm) {
        System.out.println("HIT ENDPOINT");
        chat2Service.sendMessage(to, sendMessageForm.getMessage(), Optional.ofNullable(sendMessageForm.getTopic()), Optional.ofNullable(sendMessageForm.getImages()));
    }

    @GetMapping("/api/v1/chat/{chatId}")
    public ResponseEntity<?> getChat(@PathVariable String chatId) {
        try {
            return ResponseEntity.ok().body(chat2Service.getChat(chatId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/api/v1/chat/reset/{chatId}")
    public ResponseEntity<?> reset(@PathVariable String chatId) {
        try {
            chat2Service.resetCount(chatId);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/api/v1/chat/reset/{chatId}/{username}")
    public ResponseEntity<?> resetCount(@PathVariable String chatId,@PathVariable String username) {
        try {
            chat2Service.resetCountForUser(chatId,username);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }



    @PutMapping("/api/v1/chat/delete/{chatId}")
    public ResponseEntity<?> deleteChat(@PathVariable String chatId) {
        try {
            chat2Service.deleteChat(chatId);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/api/v1/chat/{chatId}/messages")
    public ResponseEntity<?> getChatMessages(@PathVariable String chatId) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/bankAccountDetails/createBankAccountDetails").toUriString());
        try {
            return ResponseEntity.created(uri).body(chat2Service.getChatMessages(chatId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

}

@Data
@NoArgsConstructor
class SendMessageForm {
    private ChatMessage2 message;
    private Long topic;
    private List<String> images;
}