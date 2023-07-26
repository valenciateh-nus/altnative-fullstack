package com.altnative.Alt.Native.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    @Column(unique = true)
    private String categoryName;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<Project> projects;

    @OneToOne
    private Image image;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<MarketplaceListing> marketplaceListings;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<SwapRequest> swapRequests;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<SwapItem> swapItems;

    public Category(String categoryName) {
        this.categoryName = categoryName;
    }
}
