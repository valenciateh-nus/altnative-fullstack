package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.FollowUpStatus;
import com.altnative.Alt.Native.Enum.ItemCondition;
import com.altnative.Alt.Native.Enum.SwapRequestStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    @NotBlank(message = "Name of the item to be swapped is mandatory")
    @Column(length = 5000)
    private String itemName;

    @NotBlank(message = "Description of the item to be swapped is mandatory")
    @Column(length = 5000)
    private String itemDescription;

    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    @OneToMany
    private List<Image> imageList;

    private String trackingNumber;

    @Enumerated
    private SwapRequestStatus swapRequestStatus;

    @ManyToOne
    @JoinColumn(name = "APPUSER_ID", referencedColumnName = "ID", nullable = false)
    private AppUser appUser;

    private ItemCondition itemCondition;

    private String adminRemarks;

    private Integer creditsToAppUser;

    private FollowUpStatus followUpStatus;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date selfCollectionDate;

    @OneToMany
    private List<Delivery> deliveries;

    public SwapRequest() {
        this.swapRequestStatus = SwapRequestStatus.PENDING_REVIEW;
        this.imageList = new ArrayList<>();
        this.dateCreated = new Date();
        this.deliveries = new ArrayList<>();
    }

    public SwapRequest(String itemName, String itemDescription, Category category, List<Image> imageList, ItemCondition itemCondition) {
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.category = category;
        this.imageList = imageList;
        this.itemCondition = itemCondition;
        this.swapRequestStatus = SwapRequestStatus.PENDING_REVIEW;
    }
}
