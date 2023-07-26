package com.altnative.Alt.Native.Model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.util.*;

@Getter
@Setter
@ToString
@Entity
@Inheritance
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Column(length = 5000)
    private String description;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date proposedCompletionDate;

    @NotNull
    @DecimalMin(value = "0.0")
    @Digits(integer=10, fraction=2)
    private Double price;

    @OneToMany
    private List<Image> imageList;

    @OneToMany
    private List<Tag> tagList;

    @OneToMany
    private List<Material> materialList;

    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    @NotNull
    private boolean isAvailable = true;

    public Project() {
        this.dateCreated = Calendar.getInstance().getTime();
    }

    public Project(String title, String description, Double price) {
        this.title = title;
        this.description = description;
        this.dateCreated = Calendar.getInstance().getTime();
        this.price = price;
        this.imageList = new ArrayList<>();
        this.tagList = new ArrayList<>();
        this.materialList = new ArrayList<>();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Project project = (Project) o;
        return Double.compare(project.price, price) == 0 && Objects.equals(id, project.id) && Objects.equals(title, project.title) && Objects.equals(description, project.description) && Objects.equals(dateCreated, project.dateCreated) && Objects.equals(imageList, project.imageList) && Objects.equals(tagList, project.tagList) && Objects.equals(materialList, project.materialList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, dateCreated, price, imageList, tagList, materialList);
    }
}
