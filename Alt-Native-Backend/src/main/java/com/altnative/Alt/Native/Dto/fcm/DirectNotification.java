package com.altnative.Alt.Native.Dto.fcm;

import lombok.Data;

@Data
public class DirectNotification extends AppNotification {

    String target;
}