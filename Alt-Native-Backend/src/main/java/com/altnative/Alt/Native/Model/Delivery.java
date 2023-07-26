package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.DeliveryStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.Date;

@Getter
@Setter
@EqualsAndHashCode
@ToString
@Entity
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Enumerated
    private DeliveryStatus deliveryStatus;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date creationDate;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date arrangedDate;

//    @NotBlank(message = "Courier name is mandatory")
    @Size(min = 1, max = 30)
    private String courierName;

    @Column(unique = true)
    private String trackingNumber;

    @NotBlank(message = "Address of origin is mandatory")
    private String originAddress;

    //@NotBlank(message = "Address of destination is mandatory")
    private String destinationAddress;

    @NotBlank(message = "Sender username is mandatory")
    private String senderUsername;

    @Nullable
    private String receiverUsername;

    @Nullable
    private String parcelDescription;

    @Nullable
    private Long parcelWeight;

    @Nullable
    private Long parcelHeight;

    @Nullable
    private Long parcelWidth;

    @Nullable
    private Long parcelLength;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order2 order;

    @OneToOne
    @JoinColumn(name = "offer_id")
    @Nullable
    @JsonIgnoreProperties({"transactions","projectRequest","projectListing","marketplaceListing","event","appUser","swapRequest"})
    private Offer offer;

    public Delivery() {
        this.deliveryStatus = DeliveryStatus.CONTACTING_COURIER;
    }
}
