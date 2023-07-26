package com.altnative.Alt.Native.Model;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Entity
public class ChatMessage2 {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String message;

    @NotNull
    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    private String sender;

    private String receiver;

    @OneToMany
    @Nullable
    private List<Image> images;

    private boolean offer;

    private boolean forceRefresh;

    private String chatId;

    public ChatMessage2() {
    }

    public ChatMessage2(String message, String sender, String receiver, Optional<List<Image>> images, boolean offer, String chatId) {
        this.message = message;
        this.sender = sender;
        this.images = images.isPresent() ? images.get() : null;
        this.offer = offer;
        this.chatId = chatId;
        this.dateCreated = new Date();
        this.forceRefresh = false;
        this.receiver = receiver;
    }

    public ChatMessage2(String message, String sender, String receiver, Optional<List<Image>> images, boolean offer, String chatId, boolean forceRefresh) {
        this.message = message;
        this.sender = sender;
        this.images = images.isPresent() ? images.get() : null;
        this.offer = offer;
        this.chatId = chatId;
        this.dateCreated = new Date();
        this.forceRefresh = forceRefresh;
        this.receiver = receiver;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    @Nullable
    public List<Image> getImages() {
        return images;
    }

    public void setImages(@Nullable List<Image> images) {
        this.images = images;
    }

    public boolean isOffer() {
        return offer;
    }

    public void setOffer(boolean offer) {
        this.offer = offer;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public boolean isForceRefresh() {
        return forceRefresh;
    }

    public void setForceRefresh(boolean forceRefresh) {
        this.forceRefresh = forceRefresh;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatMessage2 that = (ChatMessage2) o;
        return Objects.equals(chatId,that.chatId) && offer == that.offer && Objects.equals(id, that.id) && Objects.equals(message, that.message) && Objects.equals(dateCreated, that.dateCreated) && Objects.equals(sender, that.sender) && Objects.equals(images, that.images);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, message, dateCreated, sender, images, offer, chatId);
    }
}
