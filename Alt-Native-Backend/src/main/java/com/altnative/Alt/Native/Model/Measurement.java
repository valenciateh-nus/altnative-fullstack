package com.altnative.Alt.Native.Model;

import lombok.*;
import org.springframework.lang.Nullable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Null;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@NoArgsConstructor
@Entity
public class Measurement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Nullable
    @Min(0)
    private int shoulderWidth;

    @Nullable
    @Min(0)
    private int ptp;

    @Nullable
    @Min(0)
    private int chestCircumference;

    @Nullable
    @Min(0)
    private int waist;

    @Nullable
    @Min(0)
    private int torsoLength;

    @Nullable
    @Min(0)
    private int sleeveLength;

    @Nullable
    @Min(0)
    private int sleeveCircumference;

    @Nullable
    @Min(0)
    private int hips;

    @Nullable
    @Min(0)
    private int thighCircumference;

    @Nullable
    @Min(0)
    private int kneeCircumference;

    @Nullable
    @Min(0)
    private int calfCircumference;

    @Nullable
    @Min(0)
    private int down;

    public Measurement(int shoulderWidth, int ptp, int chestCircumference, int waist, int torsoLength, int sleeveLength, int sleeveCircumference, int hips, int thighCircumference, int kneeCircumference, int calfCircumference, int down) {
        this.shoulderWidth = shoulderWidth;
        this.ptp = ptp;
        this.chestCircumference = chestCircumference;
        this.waist = waist;
        this.torsoLength = torsoLength;
        this.sleeveLength = sleeveLength;
        this.sleeveCircumference = sleeveCircumference;
        this.hips = hips;
        this.thighCircumference = thighCircumference;
        this.kneeCircumference = kneeCircumference;
        this.calfCircumference = calfCircumference;
        this.down = down;
    }

}
