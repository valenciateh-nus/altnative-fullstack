//package com.altnative.Alt.Native.Model;
//
//import com.altnative.Alt.Native.Enum.AddOnStatus;
//import lombok.*;
//import org.springframework.format.annotation.DateTimeFormat;
//
//import javax.persistence.*;
//import javax.validation.constraints.Min;
//import javax.validation.constraints.NotNull;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//
//@Entity
//@AllArgsConstructor
//@Getter
//@Setter
//@ToString
//@EqualsAndHashCode
//public class AddOnOrder {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
//
////    @OneToOne(cascade= CascadeType.ALL)//one-to-one
////    @JoinColumn(name="OFFER_ID")
////    private Offer offer;
//
//    @OneToOne(cascade= CascadeType.ALL)//one-to-one
//    @JoinColumn(name="ADDONTRANSACTION_ID")
//    @NotNull
//    private AddOnTransaction addOnTransaction;
//
//    @NotNull
//    private Long offerId; //this is the invoice number OF THE ACTUAL OFFER (not addOn)
//
//    @NotNull
//    private Long orderId;
//
//    @NotNull
//    private Long addOnId;
//
//    @NotNull
//    private Long addOnTransactionId; //this is the invoice number OF THE ACTUAL OFFER (not addOn)
//
//    // this refers to refashionee
//    @NotNull
//    private String appUserUsername;
//
//    @NotNull
//    private String refashionerUsername;
//
//    @NotNull
//    @Min(0)
//    private Double price;
//
//    @Enumerated
//    private AddOnStatus addOnStatus;
//
//    @OneToMany
//    private List<Milestone> milestones;
//
//    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
//    private Date addOnOrderTime;
//
//    public AddOnOrder() {
//        this.milestones = new ArrayList<>();
//        this.addOnStatus = AddOnStatus.ACCEPTED; //all orders are already accepted by default
//    }
//
//    //    public AddOnOrder(Double price) { //create an order for an addon
////        // this.dateCreated = Calendar.getInstance().getTime();
////        this.price = price;
////        this.addOnOrderStatus = AddOnOrderStatus.PENDING_PAYMENT;
////        this.milestones = new ArrayList<>();
////    }
//
////    public AddOnOrder(Double price, AddOnTransaction addOnTransaction) { //create an order from an add on transaction
////        // this.dateCreated = Calendar.getInstance().getTime();
////        this.price = price;
////        this.addOnTransaction = addOnTransaction;
////        this.addOnOrderStatus = AddOnOrderStatus.PENDING_PAYMENT;
////        this.milestones = new ArrayList<>();
////    }
//}
