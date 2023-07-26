package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.RefashionerNotFoundException;
import com.altnative.Alt.Native.Exceptions.UsernameExistsException;
import com.altnative.Alt.Native.Model.Chat2;
import com.altnative.Alt.Native.Model.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface UserService {
    User createUser(User user) throws UsernameExistsException;

    void updateNotificationToken(String token);

    User getUser(String username) throws UsernameNotFoundException;

    List<User> getUsers();

    User getUserFromToken(HttpServletRequest request);

    String getCurrentUsername();

    void deleteUser(String username) throws UsernameNotFoundException, NoAccessRightsException;

    public List<User> getUserByRoles(List<String> roles);

    Map<String, Chat2> getAllUserChats(User user);
}
