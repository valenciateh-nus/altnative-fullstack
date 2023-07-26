package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Model.Chat;
import com.altnative.Alt.Native.Repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Override
    public Optional<String> getChatId(
            String senderId, String recipientId, boolean createIfNotExist) {

        return chatRepository
                .findBySenderIdAndRecipientId(senderId, recipientId)
                .map(Chat::getId)
                .or(() -> {
                    if(!createIfNotExist) {
                        return  Optional.empty();
                    }
                    var chatId =
                            String.format("%s_%s", senderId, recipientId);

                    Chat senderRecipient = Chat
                            .builder()
                            .id(chatId)
                            .senderId(senderId)
                            .recipientId(recipientId)
                            .build();

                    Chat recipientSender = Chat
                            .builder()
                            .chatId(chatId)
                            .senderId(recipientId)
                            .recipientId(senderId)
                            .build();
                    chatRepository.save(senderRecipient);
                    chatRepository.save(recipientSender);

                    return Optional.of(chatId);
                });
    }
}
