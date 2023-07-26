package com.altnative.Alt.Native.Firebase;

import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import com.altnative.Alt.Native.Dto.fcm.DirectNotification;
import com.altnative.Alt.Native.Dto.fcm.SubscriptionRequest;
import com.altnative.Alt.Native.Dto.fcm.TopicNotification;
import com.altnative.Alt.Native.Model.PushNotificationRequest;
import com.google.firebase.messaging.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FCMService {

    private Logger logger = LoggerFactory.getLogger(FCMService.class);

    public void sendNotificationToTarget(DirectNotification notification, Optional<String> redirect) {
//        Message message = Message.builder().setWebpushConfig(WebpushConfig.builder().setNotification(
//                WebpushNotification.builder()
//                        .setTitle(notification.getTitle())
//                        .setBody(notification.getMessage())
//                        .build()).build()).setToken(notification.getTarget()).build();

        Map<String, String> data = new HashMap<>();
        data.put("title", notification.getTitle());
        data.put("body", notification.getMessage());
        if(redirect.isPresent()) {
            data.put("redirect", redirect.get());
        }
        Message message = Message.builder().setWebpushConfig(WebpushConfig.builder().putAllData(data).build())
                .setToken(notification.getTarget()).build();
        FirebaseMessaging.getInstance().sendAsync(message);
    }

    public void sendNotificationToTopic(TopicNotification notification) {
        Message message = Message.builder().setWebpushConfig(WebpushConfig.builder().setNotification(
                WebpushNotification.builder()
                        .setTitle(notification.getTitle())
                        .setBody(notification.getMessage())
                        .setIcon("https://assets.mapquestapi.com/icon/v2/circle@2x.png")
                        .build()).build()).setTopic(notification.getTopic()).build();
        FirebaseMessaging.getInstance().sendAsync(message);
    }

    public void subscribeToTopic(SubscriptionRequest subscriptionRequest) {
        try {
            FirebaseMessaging.getInstance().subscribeToTopic(Collections.singletonList(subscriptionRequest.getSubscriber()), subscriptionRequest.getTopic());
        } catch (Exception e) {
        }
    }
//
//    public void sendMessage(Map<String, String> data, PushNotificationRequest request)
//            throws InterruptedException, ExecutionException {
//        Message message = getPreconfiguredMessageWithData(data, request);
//        String response = sendAndGetResponse(message);
//        logger.info("Sent message with data. Topic: " + request.getTopic() + ", " + response);
//    }
//
//    public void sendMessageWithoutData(PushNotificationRequest request)
//            throws InterruptedException, ExecutionException {
//        Message message = getPreconfiguredMessageWithoutData(request);
//        String response = sendAndGetResponse(message);
//        logger.info("Sent message without data. Topic: " + request.getTopic() + ", " + response);
//    }
//
//    public void sendMessageToToken(PushNotificationRequest request)
//            throws InterruptedException, ExecutionException {
//        Message message = getPreconfiguredMessageToToken(request);
//        String response = sendAndGetResponse(message);
//        logger.info("Sent message to token. Device token: " + request.getToken() + ", " + response);
//    }
//
//    private String sendAndGetResponse(Message message) throws InterruptedException, ExecutionException {
//        return FirebaseMessaging.getInstance().sendAsync(message).get();
//    }
//
//    private AndroidConfig getAndroidConfig(String topic) {
//        return AndroidConfig.builder()
//                .setTtl(Duration.ofMinutes(2).toMillis()).setCollapseKey(topic)
//                .setPriority(AndroidConfig.Priority.HIGH)
//                .setNotification(AndroidNotification.builder().setSound(NotificationParameter.SOUND.getValue())
//                        .setColor(NotificationParameter.COLOR.getValue()).setTag(topic).build()).build();
//    }
//
//    private ApnsConfig getApnsConfig(String topic) {
//        return ApnsConfig.builder()
//                .setAps(Aps.builder().setCategory(topic).setThreadId(topic).build()).build();
//    }
//
//    private Message getPreconfiguredMessageToToken(PushNotificationRequest request) {
//        return getPreconfiguredMessageBuilder(request).setToken(request.getToken())
//                .build();
//    }
//
//    private Message getPreconfiguredMessageWithoutData(PushNotificationRequest request) {
//        return getPreconfiguredMessageBuilder(request).setTopic(request.getTopic())
//                .build();
//    }
//
//    private Message getPreconfiguredMessageWithData(Map<String, String> data, PushNotificationRequest request) {
//        return getPreconfiguredMessageBuilder(request).putAllData(data).setTopic(request.getTopic())
//                .build();
//    }
//
//    private Message.Builder getPreconfiguredMessageBuilder(PushNotificationRequest request) {
//        AndroidConfig androidConfig = getAndroidConfig(request.getTopic());
//        ApnsConfig apnsConfig = getApnsConfig(request.getTopic());
//        return Message.builder()
//                .setApnsConfig(apnsConfig).setAndroidConfig(androidConfig).setNotification(Notification
//                        .builder()
//                        .setTitle(request.getTitle())
//                        .setBody(request.getMessage())
//                        .build());
//    }
}