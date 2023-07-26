package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.AddOnStatus;
import com.altnative.Alt.Native.Enum.OfferType;
import com.sun.istack.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class AddOn {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String description;

    @NotNull
    @Min(0)
    private Double price;

    @NotNull
    private Long offerId;

    @Enumerated
    private OfferType offerType;

    @NotNull
    private Long orderId;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date proposedCompletionDate;

    private String refashioneeUsername;

    @Enumerated
    private AddOnStatus addOnStatus;

//    @OneToMany
//    private List<AddOnTransaction> addOnTransactions;

    public AddOn(String title, String description, Double price, Date proposedCompletionDate) {
        this.price = price;
        this.title = title;
        this.description = description;
        this.proposedCompletionDate = proposedCompletionDate;
//        this.addOnTransactions = new ArrayList<>();
        this.addOnStatus = AddOnStatus.ACCEPTED;
    }
}