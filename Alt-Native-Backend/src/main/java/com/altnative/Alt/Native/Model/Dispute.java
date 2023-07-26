package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.DisputeStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;;

@Entity
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated
    private DisputeStatus disputeStatus;

    @NotNull
    private Long orderId; //store the order for ease of retrieval

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCompleted;

    @OneToMany
    private List<Image> photos;

    @NotNull
    private String description;

    @NotNull
    private double refundAmount;

    @Nullable
    private String adminRemarks;

    @Nullable
    private String refundId;

    @Nullable
    private String rejectRemarks; //reason for rejecting the dispute request

    private String refashioneeUsername; //for project
    private String refashionerUsername; //for project

    private String buyerUsername; //for marketplace
    private String sellerUsername; //for marketplace

    // creator of dispute
    @ManyToOne
    @JoinColumn(name = "APPUSER_ID", referencedColumnName = "ID")
    private AppUser appUser;

    public Dispute() {
        this.photos = new ArrayList<>();;
    }

    public Dispute(String description, double refundAmount) {
        this.description = description;
        this.refundAmount = refundAmount;
        this.photos = new ArrayList<>();
    }
}
