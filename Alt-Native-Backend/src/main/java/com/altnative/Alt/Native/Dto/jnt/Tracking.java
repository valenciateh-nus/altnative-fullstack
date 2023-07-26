package com.altnative.Alt.Native.Dto.jnt;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class Tracking {
    String tracking_id;
    String reference_number;
    String status;
    String pod_url;
    Date first_attempt;
    List<Activity> activities;
}
