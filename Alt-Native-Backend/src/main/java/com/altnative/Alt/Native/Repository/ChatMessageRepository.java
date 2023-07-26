package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.MessageStatus;
import com.altnative.Alt.Native.Model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessageRepository
        extends JpaRepository<ChatMessage, String> {

    long countBySenderIdAndRecipientIdAndStatus(
            String senderId, String recipientId, MessageStatus status);

    List<ChatMessage> findByChatId(String chatId);

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.senderId = senderId AND cm.recipientId = recipientId AND cm.chatId = chatId")
//    @Query("Select cm from ChatMessage cm where cm.senderId := senderId and cm.recipientId := recipientId and cm.chatId := chatId")
    public List<ChatMessage> findByUserIds(String senderId, String recipientId, String chatId);
}
