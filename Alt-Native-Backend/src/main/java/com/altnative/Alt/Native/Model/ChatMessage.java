package com.altnative.Alt.Native.Model;
import com.altnative.Alt.Native.Enum.MessageStatus;
import lombok.*;
import javax.persistence.Id;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    private String chatId;
    private String senderId;
    private String recipientId;
    private String senderUsername;
    private String recipientUsername;
    private String content;
    private Date timestamp;
    private MessageStatus status;
}
