package com.altnative.Alt.Native.Repository;
import com.altnative.Alt.Native.Model.Chat2;
import com.altnative.Alt.Native.Model.ChatMessage2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatMessage2Repository extends JpaRepository<ChatMessage2, Long> {

    public List<ChatMessage2> findByChatIdIs(String chatId);
}
