//package com.altnative.Alt.Native.Model;
//
//import lombok.*;
//import org.springframework.format.annotation.DateTimeFormat;
//import org.springframework.lang.Nullable;
//
//import javax.persistence.*;
//import javax.validation.constraints.NotNull;
//import javax.validation.constraints.Size;
//import java.util.Date;
//import java.util.Objects;
//
//@Getter
//@Setter
//@EqualsAndHashCode
//@ToString
//@NoArgsConstructor
//@RequiredArgsConstructor
//@Entity
//public class DeliveryInformation {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
//
//    @NotNull
//    private String refashioneeAddress;
//
//    @NotNull
//    private String refashionerAddress;
//
//    @Nullable
//    @Column(unique = true)
//    private String trackingNumber;
//
//}
