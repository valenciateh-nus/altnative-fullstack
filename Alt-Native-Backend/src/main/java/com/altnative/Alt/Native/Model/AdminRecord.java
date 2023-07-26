package com.altnative.Alt.Native.Model;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class AdminRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ElementCollection
    @CollectionTable(name = "adminrecord_refashioners",
            joinColumns = {@JoinColumn(name = "adminrecord_id")})
    @MapKeyColumn(name = "username")
    @Column(name = "views")
    Map<String, Integer> topRefashioners = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "adminrecord_searches",
            joinColumns = {@JoinColumn(name = "adminrecord_id")})
    @MapKeyColumn(name = "search_value")
    @Column(name = "occurrences")
    Map<String, Integer> topSearches = new HashMap<>();

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

//    public AdminRecord() {
//        this.topRefashioners = new HashMap<>();
//        this.topSearches = new HashMap<>();
//    }
}

