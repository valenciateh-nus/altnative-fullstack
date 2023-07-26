package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.AccountStatus;
import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Model.AppUser;
import com.altnative.Alt.Native.Model.ProjectRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface AppUserRepo extends UserBaseRepo<AppUser> {

    @Query("SELECT a FROM AppUser a JOIN FETCH a.reviews WHERE a.id = (:id)")
    public AppUser findByIdAndFetchReviewsEagerly(@Param("id") Long id);

//    @Query("SELECT a FROM AppUser a JOIN FETCH a.deliveryInformation WHERE a.id = (:id)")
//    public AppUser findByIdAndFetchDeliveryEagerly(@Param("id") Long id);

    @Query("SELECT a FROM AppUser a JOIN FETCH a.offers WHERE a.id = (:id)")
    public AppUser findByIdAndFetchOffersEagerly(@Param("id") Long id);

    @Query("SELECT a FROM AppUser a JOIN FETCH a.projectRequests WHERE a.id = (:id)")
    public AppUser findByIdAndFetchProjReqsEagerly(@Param("id") Long id);

    List<AppUser> findByUsernameContainingIgnoreCase(String username);

    List<AppUser> findByNameContainingIgnoreCase(String username);

    List<AppUser> findByRolesIn(List<Role> roles);

    List<AppUser> findByRolesInAndAccountStatusIn(List<Role> roles, List<AccountStatus> statuses);

    List<AppUser> findByRolesInAndNameContainingIgnoreCase(List<Role> roles, String name);

    List<AppUser> findByRolesInAndUsernameContainingIgnoreCase(List<Role> roles, String username);

    List<AppUser> findByRolesInAndAccountStatusInAndNameContainingIgnoreCase(List<Role> roles, List<AccountStatus> statuses, String name);

    List<AppUser> findByRolesInAndAccountStatusInAndUsernameContainingIgnoreCase(List<Role> roles, List<AccountStatus> statuses, String username);

    List<AppUser> findByAccountStatusIn(List<AccountStatus> statuses);

    List<AppUser> findByNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(String keyword, String keyword1);

    List<AppUser> findByAccountStatusInAndNameContainingIgnoreCase(List<AccountStatus> statuses, String name);

    List<AppUser> findByAccountStatusInAndUsernameContainingIgnoreCase(List<AccountStatus> statuses, String username);

    @Transactional
    @Modifying
    @Query("UPDATE AppUser a " +
            "SET a.enabled = TRUE WHERE a.username = ?1")
    int enableAppUser(String email);
}
