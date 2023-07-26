package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.RequestStatus;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import javax.validation.constraints.*;

@Getter
@Setter
@AllArgsConstructor
@ToString
@Entity
public class ProjectRequest extends Project {

    @NotNull
    @Enumerated
    private RequestStatus requestStatus;

    @OneToMany(mappedBy = "projectRequest", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Offer> offers;

    @ManyToOne
    @JoinColumn(name = "APPUSER_ID", referencedColumnName = "ID", nullable = false)
    private AppUser refashionee;

    @NotNull
    private boolean isBusiness;

    private Integer quantity = 1;

    private Integer minimum = 1;

    public ProjectRequest() {
        this.requestStatus = RequestStatus.PUBLISHED;
        this.isBusiness = false;
    }

    public ProjectRequest(String title, String description, Double price) {
        super(title, description, price);
        this.offers = new ArrayList<>();
        this.requestStatus = RequestStatus.PUBLISHED;
        this.isBusiness = false;
    }

    //business request
    public ProjectRequest(String title, String description, Double price, Integer quantity, Integer minimum) {
        super(title, description, price);
        this.offers = new ArrayList<>();
        this.requestStatus = RequestStatus.PUBLISHED;
        this.quantity = quantity;
        this.minimum = minimum;
        this.isBusiness = false;
    }
}