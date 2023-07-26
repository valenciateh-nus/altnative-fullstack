package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.EventEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToMany
    private List<Image> imageList;

    @NotBlank(message = "Event name is mandatory")
    private String eventName;

    @NotBlank(message = "Event description is mandatory")
    private String eventDescription;

    private String additionalInformation; //Instructions/Requirements

    @NotBlank(message = "Event location is mandatory")
    private String eventLocation;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date eventDateAndTime;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date eventSignupStartDate;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date eventSignupEndDate;

    @NotNull
    private Integer maximumCapacity; //number of people who can participate

    @NotNull
    private Double pricePerPax; //price per ticket

    private Integer currentCount = 0; //number of people who have signed up

    @Enumerated
    private EventEnum eventEnum;

    @NotBlank(message = "Event host is mandatory")
    private String eventHostName;

    @Column
    @ElementCollection(targetClass=String.class)
    private List<String> participants;

    @OneToMany(mappedBy = "event")
    @JsonIgnore
    private List<Offer> offers;

    public Event() {
        this.imageList = new ArrayList<>();
        this.participants = new ArrayList<>();
        this.offers = new ArrayList<>();
    }

    public Event(String eventName, String eventDescription, String eventLocation, Date eventDateAndTime, Date eventSignupStartDate, Date eventSignupEndDate, Integer maximumCapacity, Double pricePerPax, EventEnum eventEnum) {
        this.eventName = eventName;
        this.eventDescription = eventDescription;
        this.eventLocation = eventLocation;
        this.eventDateAndTime = eventDateAndTime;
//        this.eventSignupStartDate = eventSignupStartDate;
        this.eventSignupEndDate = eventSignupEndDate;
        this.maximumCapacity = maximumCapacity;
        this.pricePerPax = pricePerPax;
        this.eventEnum = eventEnum;
    }
}
