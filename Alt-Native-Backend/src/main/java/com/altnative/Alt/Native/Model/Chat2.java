package com.altnative.Alt.Native.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;

@Entity
public class Chat2 {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String chatAlternateId;

    private boolean deleted;

    private Integer user1UnreadCount = 0;

    private Integer user2UnreadCount = 0;

    @Nullable
    private Long topic;

    @OneToMany
    @JsonIgnore
    private List<ChatMessage2> messages;

    @OneToMany
    @Nullable
    private List<Order2> orders;

    @OneToOne
    @JoinColumn(name="user1_id")
    @NotNull
    @JsonIncludeProperties({"id","name","username","avatar","roles"})
    private User user1;

    @OneToOne
    @JoinColumn(name = "last_message_id")
    private ChatMessage2 lastMessage;

    @OneToOne
    @NotNull
    @JoinColumn(name="user2_id")
    @JsonIncludeProperties({"id","name","username","avatar","roles"})
    private User user2;

    public Chat2(@Nullable Long topic, @Nullable List<ChatMessage2> messages, User user1, User user2) {
        this.topic = topic;
        this.messages = messages;
        this.user1 = user1;
        this.user2 = user2;
        this.deleted = false;
        this.user1UnreadCount = 1;
        generateChatAlternativeId();
    }

    private void generateChatAlternativeId() {
        String temp = "";

        if(user1.getId() < user2.getId()) {
            temp+= user1.getId() + "_" + user2.getId();
        } else {
            temp+= user2.getId() + "_" + user1.getId();
        }
        if(topic != null) {
            temp += "_" + topic;
        }

        setChatAlternateId(temp);

    }

    public Chat2() {
        this.deleted = false;
    }

    public List<Order2> getOrders() {
        return orders;
    }

    public void setOrders(List<Order2> orders) {
        this.orders = orders;
    }

    public void addOrder(Order2 order) {
        this.orders.add(order);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setLastMessage(ChatMessage2 lastMessage) {this.lastMessage = lastMessage;}

    public ChatMessage2 getLastMessage() {return lastMessage;}

    public String getChatAlternateId() {
        return chatAlternateId;
    }

    public void setChatAlternateId(String chatAlternateId) {
        this.chatAlternateId = chatAlternateId;
    }

    @Nullable
    public Long getTopic() {
        return topic;
    }

    public void setTopic(@Nullable Long topic) {
        this.topic = topic;
        generateChatAlternativeId();
    }

    public List<ChatMessage2> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage2> messages) {
        this.messages = messages;
    }

    public void addMessage(ChatMessage2 message) {
        this.messages.add(message);
        generateChatAlternativeId();
    }

    public User getUser1() {
        return user1;
    }

    public void setUser1(User user1) {
        this.user1 = user1;
    }

    public User getUser2() {
        return user2;
    }

    public void setUser2(User user2) {
        this.user2 = user2;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Integer getUser1UnreadCount() {
        return user1UnreadCount;
    }

    public void setUser1UnreadCount(Integer user1UnreadCount) {
        this.user1UnreadCount = user1UnreadCount;
    }

    public Integer getUser2UnreadCount() {
        return user2UnreadCount;
    }

    public void setUser2UnreadCount(Integer user2UnreadCount) {
        this.user2UnreadCount = user2UnreadCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Chat2 chat2 = (Chat2) o;
        return id == chat2.id && Objects.equals(deleted, chat2.deleted) && chatAlternateId.equals(chat2.chatAlternateId) && Objects.equals(topic, chat2.topic) && Objects.equals(messages, chat2.messages) && user1.equals(chat2.user1) && user2.equals(chat2.user2);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, chatAlternateId, topic, user1, user2, deleted);
    }
}
