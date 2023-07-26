package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.AccountStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Chat2;
import com.altnative.Alt.Native.Model.User;
import com.altnative.Alt.Native.Repository.UserRepo;
import com.altnative.Alt.Native.Utility.SecurityUtility;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final Chat2Service chat2Service;

    @Override
    public User createUser(User user) throws UsernameExistsException {
        User exists = userRepo.findByUsername(user.getUsername());
        if (exists != null) {
            log.error("Username {} exists in db.", user.getUsername());
            throw new UsernameExistsException(user.getUsername());
        }
        User newUser = new User(user.getUsername(), user.getPassword());
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        log.info("Saving new user {} to db", newUser.getUsername());
        return userRepo.save(newUser);
    }

    @Override
    public void updateNotificationToken(String token) {
        User loggedInUser = getUser(getCurrentUsername());

       loggedInUser.setNotificationToken(token);
       userRepo.save(loggedInUser);
    }

    @Override
    public User getUser(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }
        return user;
    }

    @Override
    public List<User> getUserByRoles(List<String> roles) {

        List<Role> roles1 = new ArrayList<>();
        for (String role : roles) {
            roles1.add(Role.valueOf(role));
        }

        List<User> refashioners = userRepo.findByRolesIn(roles1);
        return refashioners;
    }

    @Override
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            DecodedJWT decodedJWT = SecurityUtility.decode_token(token);
            String username = decodedJWT.getSubject();
            User user = getUser(username);
            return user;
        } else {
            throw new RuntimeException("Token is missing");
        }
    }

    @Override
    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // getUsername() - Returns the username used to authenticate the user
        return authentication.getName();
    }

    @Override
    public void deleteUser(String username) throws UsernameNotFoundException, NoAccessRightsException {
        User user = getUser(username);

        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        } else {
            if (user.getUsername() != getCurrentUsername()) {
                throw new NoAccessRightsException("You are not allowed to perform this action");
            } else {
                AccountStatus accountStatus = user.getAccountStatus();
                if (accountStatus == AccountStatus.DELETED) {
                    throw new NoAccessRightsException("This account no longer exists.");
                } else {
                    user.setAccountStatus(AccountStatus.DELETED); //both type of users (active and suspended) can be deleted
                    log.info("User: {} has been deleted", user.getUsername());
                }
                userRepo.save(user);
            }
        }
    }

    @Override
    public Map<String, Chat2> getAllUserChats(User user) {
        return chat2Service.getAllUserChats(user.getUsername());
    }
}
