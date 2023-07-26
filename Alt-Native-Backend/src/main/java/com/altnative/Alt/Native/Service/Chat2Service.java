package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.Note;
import com.altnative.Alt.Native.Dto.fcm.DirectNotification;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.ChatNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Firebase.FCMService;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.Chat2Repository;
import com.altnative.Alt.Native.Repository.ChatMessage2Repository;
import com.altnative.Alt.Native.Repository.ImageRepo;
import com.altnative.Alt.Native.Repository.UserRepo;
import com.google.firebase.messaging.FirebaseMessagingException;
import io.netty.handler.codec.base64.Base64Decoder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class Chat2Service {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private final ChatMessage2Repository chatMessage2Repository;
    private final Chat2Repository chat2Repository;
    private final UserRepo userRepo;
    private final ImageRepo imageRepo;
    private final ImageService imageService;
    private final FCMService fcmService;

    //to is username
    public void sendMessage(String to, ChatMessage2 message, Optional<Long> topic, Optional<List<String>> images) {
        log.info("Sending message to: " + to);
        AppUser toUser = (AppUser) userRepo.findByUsername(to);
        if (toUser == null ) {
            throw new UsernameNotFoundException("Username: " + to + "does not exist.");
        }
        AppUser sender =  (AppUser) userRepo.findByUsername(message.getSender());
        if (sender == null ) {
            throw new UsernameNotFoundException("Username: " + message.getSender() + "does not exist.");
        }

        List<Image> imgList = new ArrayList<>();
        if(message.getImages() != null && message.getImages().size() > 0) {
            for(Image image : message.getImages()) {
                Optional<Image> imgFound = imageRepo.findById(image.getId());
                if(imgFound.isPresent()) {
                    imgList.add(imgFound.get());
                }
            }
        }

        String altId = generateChatAlternativeId(sender.getId(), toUser.getId(), topic);
        log.info("Storing to chatid: " + altId);
        ChatMessage2 newMessage = new ChatMessage2(message.getMessage(), sender.getUsername(), toUser.getUsername(), Optional.of(imgList), message.isOffer(), altId, message.isForceRefresh());
        chatMessage2Repository.save(newMessage);
        Chat2 chatExist = chat2Repository.findByChatAlternateId(altId);
        if (chatExist != null) {
            chatExist.addMessage(newMessage);
            if (toUser.getId() == chatExist.getUser1().getId() || toUser.getId().equals(chatExist.getUser1().getId())) {
                Integer curr = chatExist.getUser1UnreadCount();
                chatExist.setUser1UnreadCount(curr+1);
            } else if (toUser.getId() == chatExist.getUser2().getId() || toUser.getId().equals(chatExist.getUser2().getId())) {
                Integer curr = chatExist.getUser2UnreadCount();
                chatExist.setUser2UnreadCount(curr+1);
            }
        } else {
            chatExist = new Chat2(topic.isPresent() ? topic.get() : null, new ArrayList<ChatMessage2>(), toUser, sender);
            chatExist.addMessage(newMessage);

        }
        chatExist.setLastMessage(newMessage);
        chat2Repository.save(chatExist);
        simpMessagingTemplate.convertAndSend("/chat/messages/" + to, newMessage);
        simpMessagingTemplate.convertAndSend("/chat/messages/notification/" + to, new ChatNotification(newMessage.getSender(),newMessage.getChatId(),newMessage.getReceiver(), newMessage.getMessage()));

        if(toUser.getNotificationToken() != null) {
            Map<String,String> dataMap = new HashMap<>();
            dataMap.put("redirect-url","/chat/" + newMessage.getChatId());
            Note note = new Note(sender.getUsername(),newMessage.getMessage(),dataMap,null);
            DirectNotification dm = new DirectNotification();
            dm.setTarget(toUser.getNotificationToken());
            dm.setTitle(sender.getUsername());
            String nm = newMessage.getMessage();
            if(message.isOffer()) {
                nm = "Sent an offer.";
            }
            dm.setMessage(nm);
            String redirect = null;
            if(newMessage.getChatId() != null) {
                redirect = "/chat/" + newMessage.getChatId() + "?user2=" + sender.getUsername();
            }
            fcmService.sendNotificationToTarget(dm, Optional.ofNullable(redirect));
        }
    }

    public void resetCount(String alternativeId) throws ChatNotFoundException, NoAccessRightsException {
        Chat2 chat = getChat(alternativeId);
        chat.setUser2UnreadCount(0);
        chat.setUser1UnreadCount(0);
        chat2Repository.save(chat);
    }

    public void resetCountForUser(String alternativeId, String username) throws ChatNotFoundException, NoAccessRightsException {
        User user = userRepo.findByUsername(username);
        Chat2 chat = getChat(alternativeId);
        if(user.getId() == chat.getUser1().getId()) {
            chat.setUser1UnreadCount(0);
        } else if(user.getId() == chat.getUser2().getId()){
            chat.setUser2UnreadCount(0);
        }
        chat2Repository.save(chat);
    }

    public Chat2 getChat(String alternativeId) throws ChatNotFoundException, NoAccessRightsException {
        Chat2 chatExist = chat2Repository.findByChatAlternateId(alternativeId);
        Authentication loggedInUser = SecurityContextHolder.getContext().getAuthentication();
        if (chatExist != null) {
            if(chatExist.getUser1().getUsername().equalsIgnoreCase(loggedInUser.getName()) || chatExist.getUser2().getUsername().equalsIgnoreCase(loggedInUser.getName())) {
                return chatExist;
            } else {
                throw new NoAccessRightsException("You do not have access to this chat!");
            }

        } else {
            throw new ChatNotFoundException("Chat not found");
        }
    }

    public String generateChatAlternativeId(long userId1, long userId2, Optional<Long> topicId) {
        String temp = "";

        if (userId1 < userId2) {
            temp += userId1 + "_" + userId2;
        } else {
            temp += userId2 + "_" + userId1;
        }
        if (topicId.isPresent()) {
            temp += "_" + topicId.get();
        }

        return temp;
    }

    public Map<String,Chat2> getAllUserChats(String username) {
        List<Chat2> chats = chat2Repository.getAllChatsByUsername(username);
        Map<String,Chat2> res = new HashMap<>();

        for(Chat2 chat : chats) {
            res.put(chat.getChatAlternateId(), chat);
        }

        return res;
    }

    public void deleteChat(String alternativeId) throws Exception {
        User currUser = userRepo.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        Chat2 chat = getChat(alternativeId);
        if(chat.getUser1().getId() != currUser.getId() && chat.getUser2().getId() != currUser.getId()) {
            throw new Exception("No permission to delete chat:" + alternativeId);
        }
        if(chat.isDeleted() == false) {
            chat.setDeleted(true);
        }
        chat2Repository.delete(chat);
    }

    public List<ChatMessage2> getChatMessages(String chatId) throws ChatNotFoundException, NoAccessRightsException {
        Chat2 chat = getChat(chatId);

        return chatMessage2Repository.findByChatIdIs(chat.getChatAlternateId());

    }

}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ChatNotification {
    private String sender;
    private String chatId;
    private String receiver;
    private String message;
}

