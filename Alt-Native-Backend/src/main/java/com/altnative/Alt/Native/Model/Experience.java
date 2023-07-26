package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.ExperienceLevel;
import com.altnative.Alt.Native.Enum.MilestoneEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "APPUSER_ID", referencedColumnName = "ID")
    private AppUser refashioner;

    @Enumerated
    private ExperienceLevel experienceLevel;

    public Experience(String name) {
        this.name = name;
    }
    public Experience(String name, ExperienceLevel experienceLevel) {
        this.name = name;
        this.experienceLevel = experienceLevel;
    }
}
