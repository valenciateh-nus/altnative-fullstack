package com.altnative.Alt.Native.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import java.util.*;

@Getter
@Setter
//@EqualsAndHashCode
@ToString
@Entity
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Digits(integer=10, fraction=2)
    private Double balance = 0.0;
    @NotNull
    @Digits(integer=10, fraction=2)
    private Double onHoldBalanace = 0.0;

    @OneToMany(mappedBy = "wallet")
    @JsonIgnore
    private List<WalletTransaction> walletTransactionList;

    @OneToOne
    @JsonIncludeProperties({"id","username","name","bankAccountDetails"})
    private AppUser appUser;

    public Wallet() {
        this.balance = 0.0;
        this.onHoldBalanace = 0.0;
        this.walletTransactionList = new ArrayList<>();
    }
}
