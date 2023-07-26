//package com.altnative.Alt.Native.Model;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//
//import javax.persistence.*;
//import javax.validation.constraints.NotNull;
//import java.util.List;
//
//
//@Entity
//public class Refashioner extends AppUser {
//
//    @NotNull
//    private Boolean isRevoked;
//
//    @OneToOne
//    private RefashionerRegistrationRequest refashionerRegistrationRequest;
//
//    @OneToMany(mappedBy = "refashioner")
//    @JsonIgnore
//    private List<ProjectListing> projectListings;
//
//    @OneToOne(cascade=CascadeType.ALL)//one-to-one
//    @JoinColumn(name="BANK_ACCOUNT_DETAILS_ID")
//    private BankAccountDetails bankAccountDetails;
//
//    public Refashioner() {
//    }
//
//    public Refashioner(String username, String password, String name, String phoneNumber, Boolean isRevoked) {
//        super(username, password, name, phoneNumber);
//        this.isRevoked = false;
//    }
//
//    public List<ProjectListing> getProjectListings() {
//        return projectListings;
//    }
//
//    public void setProjectListings(List<ProjectListing> projectListings) {
//        this.projectListings = projectListings;
//    }
//
//    public BankAccountDetails getBankAccountDetails() {
//        return bankAccountDetails;
//    }
//
//    public void setBankAccountDetails(BankAccountDetails bankAccountDetails) {
//        this.bankAccountDetails = bankAccountDetails;
//    }
//
//    public Refashioner(Boolean isRevoked) {
//        this.isRevoked = isRevoked;
//    }
//
//    public Boolean getRevoked() {
//        return isRevoked;
//    }
//
//    public void setRevoked(Boolean revoked) {
//        isRevoked = revoked;
//    }
//}
