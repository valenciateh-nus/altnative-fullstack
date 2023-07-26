package com.altnative.Alt.Native.Model;

import com.altnative.Alt.Native.Enum.AccountStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;
import java.util.*;

@Entity
@Inheritance
@ToString
@EqualsAndHashCode
public class User {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(unique = true)
    private String username;

    @NotNull
    @Size(min=8)
    private String password;

    @DateTimeFormat(pattern="yyyy-MM-dd'T'HH:mm:ssZ")
    private Date dateCreated;

    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "USER_ROLES",
            joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "USER_ROLES")
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<RefashionerRegistrationRequest> refashionerRegistrationRequests;

    @Enumerated
    private AccountStatus accountStatus;

    private Boolean enabled;

    @Nullable
    private String notificationToken;

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        addRole(Role.USER_REFASHIONEE.name());
        setAccountStatus(AccountStatus.ACTIVE);
        this.dateCreated = new Date();
        this.refashionerRegistrationRequests = new ArrayList<>();
        this.enabled = false;
    }

    public User(String username, String password, Boolean enabled) {
        this.username = username;
        this.password = password;
        addRole(Role.USER_REFASHIONEE.name());
        setAccountStatus(AccountStatus.ACTIVE);
        this.dateCreated = new Date();
        this.refashionerRegistrationRequests = new ArrayList<>();
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void addRole(String role) {
        this.roles.add(Role.valueOf(role));
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public void setNotificationToken(String notificationToken) {this.notificationToken = notificationToken;}

    public String getNotificationToken() {return notificationToken;}

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public List<RefashionerRegistrationRequest> getRefashionerRegistrationRequests() {
        return refashionerRegistrationRequests;
    }

    public void setRefashionerRegistrationRequests(List<RefashionerRegistrationRequest> refashionerRegistrationRequests) {
        this.refashionerRegistrationRequests = refashionerRegistrationRequests;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}