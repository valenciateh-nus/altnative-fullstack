package com.altnative.Alt.Native.Model;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Entity
public class ProjectListing extends Project {

    @OneToMany(mappedBy = "projectListing")
    @JsonIgnore
    private List<Offer> offers;

    @ManyToOne
    @JoinColumn(name = "APPUSER_ID", referencedColumnName = "ID", nullable = false)
    private AppUser refashioner;

    @NotNull
    @Min(0)
    @Max(90)
    private Integer timeToCompleteInDays;

    public ProjectListing(String title, String description, Double price) {
        super(title, description, price);
        this.offers = new ArrayList<>();
    }

    public ProjectListing(String title, String description, Double price, Integer timeToCompleteInDays) {
        super(title, description, price);
        this.offers = new ArrayList<>();
        this.timeToCompleteInDays = timeToCompleteInDays;
    }
}


