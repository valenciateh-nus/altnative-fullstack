package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.OfferStatus;
import com.altnative.Alt.Native.Enum.OfferType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@Entity
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated
    private OfferStatus offerStatus;

    @Enumerated
    private OfferType offerType;

    @NotNull
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date proposedCompletionDate;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateOfAcceptance;

    @NotNull
    @DecimalMin(value = "0.0")
    @Digits(integer=10, fraction=2)
    private Double price;

    @NotBlank(message = "Description is mandatory")
    @Column(length = 5000)
    private String description;

    @NotBlank(message = "Title is mandatory")
    private String title;

    private String paymentIntentId;

    @ManyToOne
    @JoinColumn(name = "APPUSER_ID", referencedColumnName = "ID", nullable = false)
    private AppUser appUser; // refashioner

    private String refashioneeUsername;

    //Testing for offer parent stuff
    private String sellerUsername;
    private String buyerUsername;

    private String eventParticipantUsername;

    private String swapRequesterUsername;

    @OneToMany
    private List<Transaction> transactions;

    @ManyToOne
    @Nullable
    @JoinColumn(name = "PROJECTREQUEST_ID", referencedColumnName = "ID")
    private ProjectRequest projectRequest;

    @ManyToOne
    @Nullable
    @JoinColumn(name = "PROJECTLISTING_ID", referencedColumnName = "ID")
    private ProjectListing projectListing;

    @ManyToOne
    @Nullable
    @JoinColumn(name = "SWAPREQUEST_ID", referencedColumnName = "ID")
    private SwapRequest swapRequest;

    @Nullable
    private String reasonForDecliningOffer;

    @ManyToOne
    @Nullable
    @JoinColumn(name = "MARKETPLACELISTING_ID", referencedColumnName = "ID")
    private MarketplaceListing marketplaceListing;

    @ManyToOne
    @Nullable
    @JoinColumn(name = "EVENT_ID", referencedColumnName = "ID")
    private Event event;

    @Nullable
    @Min(1)
    private Integer quantity;

    public Offer(Double price, String title, String description, Date proposedCompletionDate) {
        this.price = price;
        this.title = title;
        this.description = description;
        this.proposedCompletionDate = proposedCompletionDate;
        this.offerStatus = OfferStatus.valueOf("PENDING_RESPONSE");
        this.transactions = new ArrayList<>();
        this.quantity = 1;
    }

    public Offer(Double price, String title, String description, Date proposedCompletionDate, String reasonForDecliningOffer) {
        this.price = price;
        this.title = title;
        this.description = description;
        this.proposedCompletionDate = proposedCompletionDate;
        this.offerStatus = OfferStatus.valueOf("PENDING_RESPONSE");
        this.transactions = new ArrayList<>();
        this.reasonForDecliningOffer = reasonForDecliningOffer;
        this.quantity = 1;
    }
}



