package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.MarketplaceListingStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.*;


@Entity
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Inheritance
public class MarketplaceListing {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Column(length = 5000)
    private String description;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer=10, fraction=2)
    private Double price;

    @Enumerated
    private MarketplaceListingStatus marketplaceListingStatus;

    @OneToMany
    private List<Image> imageList;

    @OneToMany(mappedBy = "marketplaceListing")
    @JsonIgnore
    private List<Offer> offers;

    @ManyToOne
    @JoinColumn(name = "APPUSER_ID", referencedColumnName = "ID", nullable = false)
    private AppUser appUser; //seller

    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    @NotNull
    private boolean isAvailable = true;

    @NotNull
    private boolean instock = true;

    @NotNull
    private boolean isDeadstock = false;

    @Min(1)
    private Integer minimum = 1;

    @NotNull
    @Min(0)
    private Integer quantity;

    public MarketplaceListing() {
        this.dateCreated = Calendar.getInstance().getTime();
    }

    public MarketplaceListing(String title, String description, Double price, Integer quantity) {
        this.title = title;
        this.description = description;
        this.quantity = quantity;
        this.dateCreated = Calendar.getInstance().getTime();
        this.price = price;
        this.imageList = new ArrayList<>();
    }

    // deadstocks have to indicate the minimum no. of items per purchase
    public MarketplaceListing(String title, String description, Double price, Integer quantity, Integer minimum) {
        this.title = title;
        this.description = description;
        this.quantity = quantity;
        this.dateCreated = Calendar.getInstance().getTime();
        this.price = price;
        this.minimum = minimum;
        this.imageList = new ArrayList<>();
        this.setDeadstock(true);
    }

}
