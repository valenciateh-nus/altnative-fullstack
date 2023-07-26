//package com.altnative.Alt.Native.Model;
//
//import com.altnative.Alt.Native.Enum.PaymentStatus;
//import lombok.*;
//import org.springframework.format.annotation.DateTimeFormat;
//
//import javax.persistence.*;
//import javax.validation.constraints.Min;
//import javax.validation.constraints.NotNull;
//import java.util.Date;
//
//@Entity
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//@ToString
//@EqualsAndHashCode
//public class AddOnTransaction {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
//
//    @NotNull
//    @Min(0)
//    private Double amount;
//
//    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
//    private Date dateCreated;
//
//    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
//    private Date dateCompleted;
//
////    @ManyToOne
////    @JoinColumn(name = "CREDITCARD_ID", referencedColumnName = "ID")
////    private CreditCard creditCard;
//
//    @OneToOne
//    private AddOnOrder addOnOrder;
//
//    @NotNull
//    private Long addOnId;
//
//    @NotNull
//    private Long orderId;
//
//    @NotNull
//    private Long offerId; //invoice number
//
//
//    @Enumerated
//    private PaymentStatus paymentStatus;
//
////    public AddOnTransaction() { //initialize a new addOn transaction with id
////    }
//
////    public AddOnTransaction(Double amount, Date dateCreated, Date datePending, Date dateCompleted, CreditCard creditCard, AddOn addOn, AddOnOrder addOnOrder, PaymentStatus paymentStatus) {
////        this.amount = amount;
////        this.dateCreated = dateCreated;
////        this.datePending = datePending;
////        this.dateCompleted = dateCompleted;
////        this.creditCard = creditCard;
////        this.addOn = addOn;
////        this.addOnOrder = addOnOrder;
////        this.paymentStatus = paymentStatus;
////    }
//}
