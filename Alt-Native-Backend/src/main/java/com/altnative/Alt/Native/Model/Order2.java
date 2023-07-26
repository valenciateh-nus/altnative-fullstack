package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.OfferType;
import com.altnative.Alt.Native.Enum.OrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;;

@Entity
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Order2 {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

//    @NotNull
    private Long offerId; //offer that led directly to creation of order

//    @NotNull
    private String offerTitle;

    // this refers to refashionee
    private String appUserUsername;

    private String refashionerUsername;

//    @NotNull
    private Long transactionId;

//    @NotNull
    private Double orderPrice;

    @OneToMany
    private List<AddOn> addOns;

    @OneToMany
    private List<Milestone> milestones;

    @OneToMany
    private List<Dispute> disputes;

    @Enumerated
    private OrderStatus orderStatus;

    @Enumerated
    private OfferType offerType;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date orderTime;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date proposedCompletionDate;

    public String chatAlternateId;

    @OneToMany
    private List<Delivery> deliveries;

    //Testing for offer parent stuff
    private String sellerUsername;
    private String buyerUsername;

    private String eventParticipantUsername;
    private Integer ticketsPurchasedForEvent;

    private String swapRequesterUsername;

    public Order2() { //initialize an order (means transaction COMPLETED)
        this.orderStatus = OrderStatus.ACCEPTED; //must be an accepted order
        this.addOns = new ArrayList<>();
        this.milestones = new ArrayList<>(); //create the actual milestone entity in the impl classes
        this.deliveries = new ArrayList<>();
        this.disputes = new ArrayList<>();
    }
}
