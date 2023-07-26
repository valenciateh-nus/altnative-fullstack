package com.altnative.Alt.Native.Model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.Calendar;
import java.util.Date;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "5.0")
    @Digits(integer=1, fraction=1)
    private Double reviewRating;

    @NotBlank(message = "Description is mandatory")
    @Column(length = 5000)
    private String description;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    // user who wrote this review
    @ManyToOne
    private AppUser owner;

    // user getting reviewed aka 'target' of review
    @ManyToOne
    @JoinColumn(name="APPUSER_ID", referencedColumnName = "ID")
    private AppUser appUser;

    public Review() {
        this.dateCreated = Calendar.getInstance().getTime();
    }

    public Review(Double reviewRating, String description, AppUser appUser) {
        this.reviewRating = reviewRating;
        this.description = description;
        this.dateCreated = Calendar.getInstance().getTime();
        this.appUser = appUser;
    }
}
