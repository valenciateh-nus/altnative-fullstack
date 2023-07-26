package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface UserRepo extends UserBaseRepo<User> {

    @Query("SELECT u FROM User u JOIN FETCH u.refashionerRegistrationRequests WHERE u.id = (:id)")
    public User findByIdAndFetchReqsEagerly(@Param("id") Long id);

    public List<User> findByRolesIn(List<Role> roles);

}

