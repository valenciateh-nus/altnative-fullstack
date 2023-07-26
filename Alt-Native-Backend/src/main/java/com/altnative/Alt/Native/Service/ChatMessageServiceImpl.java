package com.altnative.Alt.Native.Service;


import com.altnative.Alt.Native.Enum.MessageStatus;
import com.altnative.Alt.Native.Exceptions.ResourceNotFoundException;
import com.altnative.Alt.Native.Model.ChatMessage;
import com.altnative.Alt.Native.Model.ChatMessage2;
import com.altnative.Alt.Native.Repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private ChatService chatService;

    @Override
    public ChatMessage save(ChatMessage chatMessage) {
        chatMessage.setStatus(MessageStatus.RECEIVED);
        chatMessageRepository.save(chatMessage);
        return chatMessage;
    }

    @Override
    public long countNewMessages(String senderId, String recipientId) {
        return chatMessageRepository.countBySenderIdAndRecipientIdAndStatus(
                senderId, recipientId, MessageStatus.RECEIVED);
    }

    @Override
    public List<ChatMessage> findChatMessages(String senderId, String recipientId) {
        var chatId = chatService.getChatId(senderId, recipientId, false);

        var messages =
                chatId.map(cId -> chatMessageRepository.findByChatId(cId)).orElse(new ArrayList<>());

        if(messages.size() > 0) {
            updateStatuses(senderId, recipientId, MessageStatus.DELIVERED, chatId.toString());
        }

        return messages;
    }

    @Override
    public ChatMessage findById(String id) {
        return chatMessageRepository
                .findById(id)
                .map(chatMessage -> {
                    chatMessage.setStatus(MessageStatus.DELIVERED);
                    return chatMessageRepository.save(chatMessage);
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException("can't find message (" + id + ")"));
    }

    @Override
    public List<ChatMessage> findByUserIds(String senderId, String recipientId, String chatId) {
        return chatMessageRepository.findByUserIds(senderId, recipientId, chatId);
    }

    @Override
    public void updateStatuses(String senderId, String recipientId, MessageStatus status, String chatId) {
        List<ChatMessage> chatMessages = this.findByUserIds(senderId, recipientId, chatId);
        for (ChatMessage cm : chatMessages) {
            cm.setStatus(status);
            chatMessageRepository.save(cm);
        }
//
//
//        Query query = new Query(
//                Criteria
//                        .where("senderId").is(senderId)
//                        .and("recipientId").is(recipientId));
//        Update update = Update.update("status", status);
//        mongoOperations.updateMulti(query, update, ChatMessage.class);
    }


}