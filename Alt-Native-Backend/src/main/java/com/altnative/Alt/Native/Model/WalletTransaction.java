package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.WalletStatus;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.annotation.Nullable;
import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import java.util.Calendar;
import java.util.Date;

@Entity
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String paymentIntentId;

    private String transactionId;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 10, fraction = 2)
    private Double amount;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCompleted;

    @ManyToOne
    @JoinColumn(name = "WALLET_ID", referencedColumnName = "ID", nullable = false)
    private Wallet wallet;

    @Enumerated
    private WalletStatus paymentStatus;

    @Nullable
    private String remarks;

    public WalletTransaction() {
        this.dateCreated = Calendar.getInstance().getTime();
    }
}
