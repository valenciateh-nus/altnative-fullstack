package com.altnative.Alt.Native.Dto.fcm;

import lombok.Data;

@Data
public class SubscriptionRequest extends AppNotification {

    // The subscriber field specifies the token of the subscribing user
    String subscriber;
    String topic;
}