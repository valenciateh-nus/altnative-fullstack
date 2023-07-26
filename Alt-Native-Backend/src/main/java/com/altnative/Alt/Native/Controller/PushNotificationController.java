package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Dto.fcm.DirectNotification;
import com.altnative.Alt.Native.Dto.fcm.SubscriptionRequest;
import com.altnative.Alt.Native.Dto.fcm.TopicNotification;
import com.altnative.Alt.Native.Firebase.FCMService;
import com.altnative.Alt.Native.Model.PushNotificationRequest;
import com.altnative.Alt.Native.Model.PushNotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class PushNotificationController {

    private final FCMService fcmService;

//    private PushNotificationService pushNotificationService;

    @PostMapping("/notification")
    public ResponseEntity sendTargetedNotification(@RequestBody DirectNotification directNotification) {
        fcmService.sendNotificationToTarget(directNotification,null);
        return new ResponseEntity<>(new PushNotificationResponse(HttpStatus.OK.value(), "Notification has been sent."), HttpStatus.OK);
    }

    @PostMapping("/topic/notification")
    public ResponseEntity sendNotificationToTopic(@RequestBody TopicNotification topicNotification) {
        fcmService.sendNotificationToTopic(topicNotification);
        return new ResponseEntity<>(new PushNotificationResponse(HttpStatus.OK.value(), "Notification has been sent."), HttpStatus.OK);
    }

    @PostMapping("/topic/subscription")
    public ResponseEntity subscribeToTopic(@RequestBody SubscriptionRequest subscriptionRequest) {
        fcmService.subscribeToTopic(subscriptionRequest);
        return new ResponseEntity<>(new PushNotificationResponse(HttpStatus.OK.value(), "Subscribed"), HttpStatus.OK);
    }
//
//    @PostMapping("/notification/token")
//    public ResponseEntity sendTokenNotification(@RequestBody PushNotificationRequest request) {
//        pushNotificationService.sendPushNotificationToToken(request);
//        return new ResponseEntity<>(new PushNotificationResponse(HttpStatus.OK.value(), "Notification has been sent."), HttpStatus.OK);
//    }
//
//    @PostMapping("/notification/data")
//    public ResponseEntity sendDataNotification(@RequestBody PushNotificationRequest request) {
//        pushNotificationService.sendPushNotification(request);
//        return new ResponseEntity<>(new PushNotificationResponse(HttpStatus.OK.value(), "Notification has been sent."), HttpStatus.OK);
//    }
//
//    @GetMapping("/notification")
//    public ResponseEntity sendSampleNotification() {
//        pushNotificationService.sendSamplePushNotification();
//        return new ResponseEntity<>(new PushNotificationResponse(HttpStatus.OK.value(), "Notification has been sent."), HttpStatus.OK);
//    }
}
