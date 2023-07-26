package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Inheritance
public class AppUser extends User{
    private String name;
    private String phoneNumber;
    private String customerId;

    @OneToOne
    @JoinColumn(name = "avatar_id")
    @Nullable
    private Image avatar;

    @OneToOne
    @Nullable
    @JoinColumn(name="wallet_id")
    private Wallet wallet;

    @OneToMany(mappedBy="appUser")
    @Nullable
    @JsonIgnore
    private List<Review> reviews;

    @Nullable
    private String address;

    // for business
    @Nullable
    private String site;

    // for business
    @Nullable
    private String description;

    @OneToMany(mappedBy="appUser")
    @Nullable
    @JsonIgnore
    private List<Offer> offers;

    @OneToMany(mappedBy = "appUser")
    @Nullable
    @JsonIgnore
    private List<Offer> marketplaceListingOffers;

    @OneToMany(mappedBy="appUser")
    @Nullable
    @JsonIgnore
    private List<Offer> eventOffers;

    @OneToMany(mappedBy = "refashionee")
    @JsonIgnore
    private List<ProjectRequest> projectRequests;

    @OneToMany(mappedBy = "appUser")
    @JsonIgnore
    private List<SwapRequest> swapRequests;

    @OneToMany(mappedBy = "appUser")
    @JsonIgnore
    private List<SwapItem> swapItems;

    @Nullable
    private Long approvedRefashionerRegistrationRequestId;

    @OneToMany(mappedBy = "refashioner")
    @JsonIgnore
    private List<ProjectListing> projectListings;

    @OneToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="BANK_ACCOUNT_DETAILS_ID")
    private BankAccountDetails bankAccountDetails;

    @OneToMany(mappedBy = "appUser")
    @JsonIgnore
    private List<MarketplaceListing> marketplaceListings;

    @OneToMany(mappedBy = "appUser")
    @JsonIgnore
    private List<Dispute> disputes;

    @Column
    @ElementCollection(targetClass=Long.class)
    private List<Long> eventIds; //events that user signed up for

    @ManyToMany
    @JoinTable(name = "marketplaceListingFavourites",
            joinColumns = {@JoinColumn(name="id")},
            inverseJoinColumns = {@JoinColumn(name = "favouriteUser_id")}
    )
    @JsonIgnore
    private List<MarketplaceListing> marketplaceListingFavourites;

    @ManyToMany
    @JoinTable(name = "projectListingFavourites",
    joinColumns = {@JoinColumn(name="id")},
    inverseJoinColumns = {@JoinColumn(name = "favouriteUser_id")}
    )
    @JsonIgnore
    private List<ProjectListing> projectListingFavourites;

    @ManyToMany
    @JoinTable(
            name = "refashionerFavourites",
            joinColumns = { @JoinColumn(name = "id") },
            inverseJoinColumns = { @JoinColumn(name = "favouriteUser_id") }
    )
    @JsonIgnore
    private List<AppUser> refashionerFavourites;

    @Nullable
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date statusDate;

    @OneToOne
    private Measurement measurement;

    @ElementCollection(targetClass = Experience.class)
    private List<Experience> expertises;

    @ElementCollection(targetClass = String.class)
    private List<String> traits;

    @ElementCollection(targetClass = String.class)
    private List<String> approvedCertifications; //this is for the certifications that have been verified by admins

    @ElementCollection(targetClass = Image.class)
    private List<Image> certifications;

    @Nullable
    @Column(length = 5000)
    private String refashionerDesc;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "5.0")
    @Digits(integer=1, fraction=1)
    private Double rating = 0.0;

    private Integer credits = 0;

    public AppUser(String username, String password, String name, String phoneNumber) {
        super(username, password);
        this.name = name;
        this.phoneNumber = phoneNumber;
        addRole(Role.USER_REFASHIONEE.name());
        this.reviews = new ArrayList<>();
        this.offers = new ArrayList<>();
        this.projectRequests = new ArrayList<>();
        this.marketplaceListings = new ArrayList<>();
        this.refashionerFavourites = new ArrayList<>();
        this.expertises = new ArrayList<>();
        this.approvedCertifications = new ArrayList<>();
        this.certifications = new ArrayList<>();
        this.marketplaceListingOffers = new ArrayList<>();
        this.disputes = new ArrayList<>();
        this.rating = 0.0; //starting off everyone has 5.0 rating
        this.eventIds = new ArrayList<>();
        this.eventOffers = new ArrayList<>();
        this.credits = 0;
    }

    public AppUser(String username, String password, String name, String phoneNumber, String site, String description) {
        super(username, password);
        this.name = name;
        this.phoneNumber = phoneNumber;
        addRole(Role.USER_REFASHIONEE.name());
        this.site = site;
        this.description = description;
        this.reviews = new ArrayList<>();
        this.offers = new ArrayList<>();
        this.projectRequests = new ArrayList<>();
        this.marketplaceListings = new ArrayList<>();
        this.refashionerFavourites = new ArrayList<>();
        this.expertises = new ArrayList<>();
        this.approvedCertifications = new ArrayList<>();
        this.certifications = new ArrayList<>();
        this.marketplaceListingOffers = new ArrayList<>();
        this.disputes = new ArrayList<>();
        this.rating = 0.0; //starting off everyone has 5.0 rating
        this.eventIds = new ArrayList<>();
        this.eventOffers = new ArrayList<>();
        this.credits = 0;
    }
  
  public AppUser(String username, String password, String name, String phoneNumber, Boolean enabled) {
        super(username, password, enabled);
        this.name = name;
        this.phoneNumber = phoneNumber;
        addRole(Role.USER_REFASHIONEE.name());
        this.reviews = new ArrayList<>();
        this.offers = new ArrayList<>();
        this.projectRequests = new ArrayList<>();
        this.marketplaceListings = new ArrayList<>();
        this.refashionerFavourites = new ArrayList<>();
        this.expertises = new ArrayList<>();
        this.approvedCertifications = new ArrayList<>();
        this.certifications = new ArrayList<>();
        this.marketplaceListingOffers = new ArrayList<>();
        this.disputes = new ArrayList<>();
        this.rating = 0.0; //starting off everyone has 5.0 rating
        this.eventIds = new ArrayList<>();
        this.eventOffers = new ArrayList<>();
        this.credits = 0;
    }

}