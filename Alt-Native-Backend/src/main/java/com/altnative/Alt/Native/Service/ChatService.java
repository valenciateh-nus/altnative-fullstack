package com.altnative.Alt.Native.Service;

import java.util.Optional;

public interface ChatService {
    public Optional<String> getChatId(
            String senderId, String recipientId, boolean createIfNotExist);
}
