package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.util.List;

@NoRepositoryBean
public interface UserBaseRepo<T extends User> extends JpaRepository<T, Long> {

    public T findByUsername(String username);

    List<T> findByUsernameContainingIgnoreCase(String username);

    List<T> findByRolesInAndUsernameContainingIgnoreCase(List<Role> roles, String username);
}
