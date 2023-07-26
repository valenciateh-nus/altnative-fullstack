package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.*;

@Entity
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 10, fraction = 2)
    private Double amount;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCompleted;

    private String paymentIntentId;

    @NotNull
    private Long offerId;

    @OneToOne
    private Order2 order2;

    @OneToOne
    private SwapItem swapItem;

    @Enumerated
    private PaymentStatus paymentStatus;

    public Transaction() {
        this.dateCreated = Calendar.getInstance().getTime();
    }
}
