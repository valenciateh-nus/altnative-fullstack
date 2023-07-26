package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Chat2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Chat2Repository extends JpaRepository<Chat2, Long> {
    public Chat2 findByChatAlternateId(String alternateId);
    @Query("SELECT c FROM Chat2 c JOIN FETCH c.user1 u1 JOIN FETCH c.user2 u2 WHERE u1.username = (:username) OR u2.username = (:username) AND c.deleted IS FALSE")
    public List<Chat2> getAllChatsByUsername(@Param("username") String username);
}
