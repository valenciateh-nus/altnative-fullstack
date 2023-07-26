package com.altnative.Alt.Native.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class DeliveryForm {
    private String origin;
    private String destination;
    private Date arrangedDate;
    private Long weight;
    private Long height;
    private Long width;
    private Long length;
}