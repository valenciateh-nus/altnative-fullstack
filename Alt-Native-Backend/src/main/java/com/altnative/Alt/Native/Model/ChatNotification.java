package com.altnative.Alt.Native.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ChatNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    private String senderId;
    private String senderUsername;
}
