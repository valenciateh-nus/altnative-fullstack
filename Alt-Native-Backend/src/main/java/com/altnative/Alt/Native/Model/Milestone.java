package com.altnative.Alt.Native.Model;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import com.altnative.Alt.Native.Enum.MilestoneEnum;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Entity
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Nullable
    @Column(length=5000)
    private String remarks;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date date;

    @OneToMany
    @Nullable
    private List<Image> images;

//    @ManyToOne
//    @JoinColumn(name="ADDONORDER_ID", referencedColumnName = "ID")
//    private AddOnOrder addOnOrder;

//    @ManyToOne
//    @JoinColumn(name="ORDER2_ID", referencedColumnName = "ID")
//    @NotNull
//    private Order2 order2;

    @NotNull
    private Long orderId;

    private Long offerId;

    @Nullable
    private Long addOnId;

    @Nullable
    private Long disputeId;

    @Enumerated
    private MilestoneEnum milestoneEnum;

    public Milestone() { //initialize an empty milestone with id
        this.images = new ArrayList<>();
    }

}
