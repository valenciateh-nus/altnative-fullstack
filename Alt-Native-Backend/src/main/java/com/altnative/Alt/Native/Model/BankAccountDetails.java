package com.altnative.Alt.Native.Model;

import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class BankAccountDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String bankAccountNo;

    @NotNull
    private String bankAccountName;

    @Nullable
    private String bankAccountBranch;

    @OneToOne
    private Image prevBankStatement;

    @Nullable
    private Boolean verified;

    @OneToOne
    @JsonIncludeProperties({"username", "id"})
    private AppUser appUser;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date dateCreated;

    @Column(length = 5000)
    private String remarks;

    public BankAccountDetails(String bankAccountNo, String bankAccountName, String bankAccountBranch) {
        this.bankAccountNo = bankAccountNo;
        this.bankAccountName = bankAccountName;
        this.bankAccountBranch = bankAccountBranch;
        this.dateCreated = new Date();

        // unverified when first created
        this.verified = false;
    }
}
