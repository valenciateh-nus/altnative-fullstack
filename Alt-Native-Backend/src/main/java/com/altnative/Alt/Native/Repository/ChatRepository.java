package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, String> {
    Optional<Chat> findBySenderIdAndRecipientId(String senderId, String recipientId);
}