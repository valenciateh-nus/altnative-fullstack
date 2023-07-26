package com.altnative.Alt.Native.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.validation.constraints.NotBlank;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {

    @NotBlank(message = "Subject is mandatory")
    @Column(length = 5000)
    private String subject;

    @NotBlank(message = "Content is mandatory")
    @Column(length = 5000)
    private String content;

    private Map<String, String> data;

    private String image;
}
