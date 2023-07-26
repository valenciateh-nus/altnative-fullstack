package com.altnative.Alt.Native.Controller;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Service.AppUserService;
import com.altnative.Alt.Native.Service.UserService;
import com.altnative.Alt.Native.Utility.SecurityUtility;
import com.amazonaws.Response;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.StripeException;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.mail.MessagingException;
import javax.management.relation.InvalidRoleValueException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final AppUserService appUserService;
    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<AppUser>> getUsers() {
        return ResponseEntity.ok().body(appUserService.getUsers());
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        try {
            return ResponseEntity.ok().body(appUserService.getUser(username));
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/users/roles/{role}")
    public ResponseEntity<?> getUserByRoles(@PathVariable String role) {
        return ResponseEntity.ok().body(userService.getUserByRoles(Arrays.asList(role)));
    }

    @PutMapping("/updateNotificationToken")
    public ResponseEntity<?> updateNotificationToken(@RequestParam String token) {
        try {
            userService.updateNotificationToken(token);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // search by selection of roles AND/OR statuses AND/OR keyword for name or username
    // if no search query given, retrieve all app users
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam Optional<String[]> roles,
                                         @RequestParam Optional<String[]> statuses,
                                         @RequestParam Optional<String> keyword) {
        ResponseEntity<?> response = null;

        if (roles.isEmpty() && statuses.isEmpty() && keyword.isEmpty()) {
            response = ResponseEntity.ok().body(appUserService.getUsers());
        } else {
            response = ResponseEntity.ok().body(appUserService.searchUsers(roles, statuses, keyword));
        }
        return response;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody AppUser user) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/user/register").toUriString());
        try {
            return ResponseEntity.created(uri).body(appUserService.createUser(user, false));
        } catch (UsernameExistsException | StripeException | MessagingException | IOException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/register2")
    public ResponseEntity<?> createUserWithAvatar(@RequestPart AppUser user, @RequestPart Optional<MultipartFile> file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/user/register2").toUriString());
        try {
            return ResponseEntity.created(uri).body(appUserService.createUserWithAvatar(user, file, false));
        } catch (UsernameExistsException | InvalidFileException | S3Exception | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/business/register")
    public ResponseEntity<?> createBusinessUser(@RequestBody AppUser user) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/business/register").toUriString());
        try {
            return ResponseEntity.created(uri).body(appUserService.createUser(user, true));
        } catch (UsernameExistsException | StripeException | MessagingException | IOException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PostMapping("/business/register2")
    public ResponseEntity<?> createBusinessUserWithAvatar(@RequestPart AppUser user, @RequestPart Optional<MultipartFile> file) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/business/register2").toUriString());
        try {
            return ResponseEntity.created(uri).body(appUserService.createUserWithAvatar(user, file, true));
        } catch (UsernameExistsException | InvalidFileException | S3Exception | NoAccessRightsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }


    @PostMapping("/updateRole")
    public ResponseEntity<?> updateRole(@RequestBody UpdateRoleForm updateRoleForm) {
        try {
            appUserService.addRole(updateRoleForm.getUsername(), updateRoleForm.getRoleName());
            return ResponseEntity.ok().build();
        } catch (InvalidRoleValueException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

    }

    @GetMapping("/token/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        AppUser user = appUserService.getUserFromToken(request);
        try {
            String access_token = SecurityUtility.generate_token(request, user, 60 * 60 * 1000 * 24 * 7);
            Map<String, String> tokens = new HashMap<>();
            tokens.put("access_token", access_token);
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(), tokens);

        } catch (Exception ex) {
            log.error("Error occurred while authorizing token/logging in: {}", ex.getMessage());
            response.setHeader("error", ex.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(), error);
        }
    }

    @PostMapping("/uploadAvatar")
    public ResponseEntity<?> uploadAvatar(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        AppUser user = appUserService.getUserFromToken(request);
        try {
            return ResponseEntity.ok().body(appUserService.uploadAvatar(user, file));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/removeAvatar")
    public ResponseEntity<?> removeAvatar(HttpServletRequest request) {
        AppUser user = appUserService.getUserFromToken(request);
        try {
            appUserService.removeAvatar(user);
            return ResponseEntity.ok().build();
        } catch (NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/suspend/{username}")
    public ResponseEntity<?> suspendUser(@PathVariable String username) {
        try {
            appUserService.suspendUser(username);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | AccountStatusCannotBeModifiedException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/unblock/{username}")
    public ResponseEntity<?> unblockUser(@PathVariable String username) {
        try {
            appUserService.unblockUser(username);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | AccountStatusCannotBeModifiedException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/deactivate/{username}")
    public ResponseEntity<?> deactivateUser(@PathVariable String username) {
        try {
            appUserService.deactivateUser(username);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | DeactivatedAccountException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/reactivate/{username}")
    public ResponseEntity<?> reactivateUser(@PathVariable String username) {
        try {
            appUserService.reactivateUser(username);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | DeactivatedAccountException | AccountStatusCannotBeModifiedException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(value = "/{username}/changePassword",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> changePassword(@PathVariable String username, @RequestBody String[] passwords) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/{username}/changePassword").toUriString());
        String currPassword = passwords[0];
        String newPassword = passwords[1];
        try {
            return ResponseEntity.created(uri).body(appUserService.editPassword(username, currPassword, newPassword));
        } catch (UsernameNotFoundException | NoAccessRightsException | InvalidPasswordException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{username}/changeUsername")
    public ResponseEntity<?> changeUsername(@PathVariable String username, @RequestBody String newUsername) {
        try {
            appUserService.editUsername(username, newUsername);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{username}/changeName")
    public ResponseEntity<?> changeName(@PathVariable String username, @RequestBody String newName) {
        try {
            appUserService.editName(username, newName);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{username}/changePhone")
    public ResponseEntity<?> changePhoneNumber(@PathVariable String username, @RequestBody String newPhoneNumber) {
        try {
            appUserService.editPhoneNumber(username, newPhoneNumber);
            return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/getAllChats")
    public ResponseEntity<Map<String, Chat2>> getAllUserChats(HttpServletRequest request) {
        User user = userService.getUserFromToken(request);
        return ResponseEntity.ok().body(userService.getAllUserChats(user));
    }

    @GetMapping("/user")
    public ResponseEntity<?> viewProfile() {
        return ResponseEntity.ok().body(appUserService.viewProfile());
    }

    @GetMapping("/getUserById")
    public ResponseEntity<?> getUserById(@RequestParam Long userId) {
        return ResponseEntity.ok().body(appUserService.getUserById(userId));
    }

    @PutMapping("/{username}/addDeliveryAddress")
    public ResponseEntity<?> addDeliveryAddress(@PathVariable String username, @RequestBody String address) {
        try {
            appUserService.addDeliveryAddress(username, address);
            return ResponseEntity.ok().body("Address modified successfully!");
        } catch (UsernameNotFoundException | NoAccessRightsException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/addressByUsername")
    public ResponseEntity<?> retrieveAddressByUsername(@RequestParam String username) {
        try {
            return ResponseEntity.ok().body(appUserService.getDeliveryAddressByUsername(username));
        } catch (AddressNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @GetMapping("/addressByUserId")
    public ResponseEntity<?> retrieveAddressByUserId(@RequestParam Long id) {
        try {
            return ResponseEntity.ok().body(appUserService.getDeliveryAddressByUserId(id));
        } catch (AddressNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/business/website")
    public ResponseEntity<?> editWebsite(@RequestBody String website) {
        appUserService.editWebsite(website);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/business/description")
    public ResponseEntity<?> editDescription(@RequestBody String description) {
        appUserService.editDescription(description);
        return ResponseEntity.ok().build();
    }
}

@Data
@NoArgsConstructor
class UpdateRoleForm {
    private String username;
    private String roleName;
}

