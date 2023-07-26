package com.altnative.Alt.Native.Dto.jnt;

import lombok.Data;

import java.util.Date;

@Data
public class Activity {
    String name;
    String reason;
    String created_by;
    Date created_at;
}
