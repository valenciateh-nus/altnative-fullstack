package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.MessageStatus;
import com.altnative.Alt.Native.Model.ChatMessage;

import java.util.List;

public interface ChatMessageService {
    public ChatMessage save(ChatMessage chatMessage);

    long countNewMessages(String senderId, String recipientId);

    List<ChatMessage> findChatMessages(String senderId, String recipientId);

    ChatMessage findById(String id);

    List<ChatMessage> findByUserIds(String senderId, String recipientId, String chatId);

    void updateStatuses(String senderId, String recipientId, MessageStatus status, String chatId);
}
