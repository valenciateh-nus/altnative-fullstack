//package com.altnative.Alt.Native.Model;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import lombok.Getter;
//import lombok.Setter;
//import org.springframework.format.annotation.DateTimeFormat;
//import org.springframework.lang.Nullable;
//
//import javax.persistence.*;
//import javax.validation.constraints.NotNull;
//import javax.validation.constraints.Null;
//import javax.validation.constraints.Size;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//import java.util.Objects;
//
//import static java.lang.Boolean.TRUE;
//
//@Entity
//@Getter
//@Setter
//public class CreditCard {
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Long id;
//
//    @Size(min=16, max=16, message = "Credit Card number must contain 16 digits.")
//    private String cardNumber;
//
//    @NotNull
//    private String cardHolderName;
//
//    @DateTimeFormat(pattern="MM-yyyy")
//    @NotNull
//    private Date expiryDate;
//
//    @Nullable
//    private Boolean preferredCard;
//
//    @OneToMany(mappedBy="creditCard")
//    @JsonIgnore
//    private List<Transaction> transactions;
//
//    @OneToMany(mappedBy="creditCard")
//    private List<AddOnTransaction> addOnTransactions;
//
//    public CreditCard() {
//        this.transactions = new ArrayList<>();
//    }
//
//    public CreditCard(String cardNumber, String cardHolderName, Date expiryDate) {
//        this.cardNumber = cardNumber;
//        this.cardHolderName = cardHolderName;
//        this.expiryDate = expiryDate;
//        this.preferredCard = TRUE;
//        this.transactions = new ArrayList<>();
//    }
//
//    public CreditCard(Long id, String cardNumber, String cardHolderName, Date expiryDate, Boolean preferredCard, List<Transaction> transactions) {
//        this.id = id;
//        this.cardNumber = cardNumber;
//        this.cardHolderName = cardHolderName;
//        this.expiryDate = expiryDate;
//        this.preferredCard = preferredCard;
//        this.transactions = transactions;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getCardNumber() {
//        return cardNumber;
//    }
//
//    public void setCardNumber(String cardNumber) {
//        this.cardNumber = cardNumber;
//    }
//
//    public List<Transaction> getTransactions() {
//        return transactions;
//    }
//
//    public void setTransactions(List<Transaction> transactions) {
//        this.transactions = transactions;
//    }
//
//    public String getCardHolderName() {
//        return cardHolderName;
//    }
//
//    public void setCardHolderName(String cardHolderName) {
//        this.cardHolderName = cardHolderName;
//    }
//
//    public Date getExpiryDate() {
//        return expiryDate;
//    }
//
//    public void setExpiryDate(Date expiryDate) {
//        this.expiryDate = expiryDate;
//    }
//
//    public Boolean getPreferredCard() {
//        return preferredCard;
//    }
//
//    public void setPreferredCard(Boolean preferredCard) {
//        this.preferredCard = preferredCard;
//    }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        CreditCard that = (CreditCard) o;
//        return Objects.equals(id, that.id) && Objects.equals(cardNumber, that.cardNumber) && Objects.equals(cardHolderName, that.cardHolderName) && Objects.equals(expiryDate, that.expiryDate) && Objects.equals(preferredCard, that.preferredCard);
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(id, cardNumber, cardHolderName, expiryDate, preferredCard);
//    }
//}
