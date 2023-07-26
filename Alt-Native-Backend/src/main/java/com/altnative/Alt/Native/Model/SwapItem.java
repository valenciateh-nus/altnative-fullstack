package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.ItemCondition;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class SwapItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String title;

    @NotBlank(message = "Description is mandatory")
    @Column(length = 5000)
    private String description;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    @NotNull
    private Integer credits;

    @OneToMany
    private List<Image> imageList;

    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    private ItemCondition itemCondition;

    @ManyToOne
    @JoinColumn(name = "APPUSER_ID", referencedColumnName = "ID", nullable = false)
    private AppUser appUser; //person who buys the item with credits

    @NotNull
    private boolean isAvailable = true;
}
