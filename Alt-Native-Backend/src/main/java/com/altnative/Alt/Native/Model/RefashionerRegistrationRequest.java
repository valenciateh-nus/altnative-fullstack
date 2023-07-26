package com.altnative.Alt.Native.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.util.*;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class RefashionerRegistrationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private Boolean verified; //verified is true when approved and false when not checked

    @Nullable
    private Boolean rejected; //rejected is false by default, will become true once checked

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date requestDate;

    @Nullable
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date verifiedDate;

    @ElementCollection(targetClass = Experience.class)
    private List<Experience> expertises;

    @ElementCollection(targetClass = String.class)
    private List<String> traits;

    @Nullable
    @ElementCollection(targetClass = Image.class)
    private List<Image> certifications;

    @Nullable
    @Column(length = 5000)
    private String refashionerDesc;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false, referencedColumnName = "ID")
    private AppUser user;

    public RefashionerRegistrationRequest() {
        this.certifications = new ArrayList<>();
        this.expertises = new ArrayList<>();
        this.traits = new ArrayList<>();
        this.verified = false; //by default
        this.rejected = false;
        this.requestDate = new Date();
    }

}


