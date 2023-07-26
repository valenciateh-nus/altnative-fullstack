package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AppUser;
//import com.altnative.Alt.Native.Model.DeliveryInformation;
import com.altnative.Alt.Native.Model.Image;
import com.altnative.Alt.Native.Model.User;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.management.relation.InvalidRoleValueException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface AppUserService {
    AppUser createUser(AppUser user, boolean isBusiness) throws StripeException, UsernameExistsException, MessagingException, IOException;

    AppUser createDummyUser(AppUser user, boolean isBusiness) throws UsernameExistsException, StripeException, MessagingException;

    AppUser createUserWithAvatar(AppUser user, Optional<MultipartFile> mpFile, boolean isBusiness) throws UsernameExistsException, InvalidFileException, S3Exception, NoAccessRightsException;

    Customer createCustomer(AppUser user) throws Exception;

    Customer getCustomer(String id) throws Exception;

    void addRole(String username, String roleName) throws UsernameNotFoundException, InvalidRoleValueException, NoAccessRightsException;

    AppUser getUser(String username) throws UsernameNotFoundException;

    AppUser getUserById(Long id) throws UserDoesNotExistException;

    List<AppUser> getUsers();

    List<AppUser> searchUsers(Optional<String[]> roles, Optional<String[]> statuses, Optional<String> keyword);

    AppUser getUserFromToken(HttpServletRequest request);

    void suspendUser(String username) throws UsernameNotFoundException, AccountStatusCannotBeModifiedException, NoAccessRightsException;

    void unblockUser(String username) throws UsernameNotFoundException, AccountStatusCannotBeModifiedException, NoAccessRightsException;

    void deactivateUser(String username) throws UsernameNotFoundException, DeactivatedAccountException, NoAccessRightsException;

    void reactivateUser(String username) throws UsernameNotFoundException, DeactivatedAccountException, AccountStatusCannotBeModifiedException;

    void editUsername(String username, String newUserName) throws UsernameNotFoundException, UsernameExistsException, NoAccessRightsException;

    AppUser editPassword(String username, String currPassword, String newPassword) throws UsernameNotFoundException, NoAccessRightsException, InvalidPasswordException;

    AppUser editPasswordDirectly(String username, String newPassword);

    void editName(String username, String newName) throws UsernameNotFoundException, NoAccessRightsException;

    // boolean checkPassword(String username, String currPassword) throws NoAccessRightsException;

    void editPhoneNumber(String username, String newPhone) throws UsernameNotFoundException, NoAccessRightsException;

    Image uploadAvatar(AppUser user, MultipartFile file) throws InvalidFileException, S3Exception, NoAccessRightsException;

    void removeAvatar(AppUser user) throws NoAccessRightsException;

//    User createUserWithAvatar(User user, MultipartFile file) throws UsernameExistsException, InvalidFileException, S3Exception, NoAccessRightsException;

    AppUser viewProfile() throws UsernameNotFoundException;

    void addDeliveryAddress(String username, String address) throws UsernameNotFoundException, NoAccessRightsException;

    String getDeliveryAddressByUsername(String username) throws UserDoesNotExistException, AddressNotFoundException;

    String getDeliveryAddressByUserId(Long id) throws UserDoesNotExistException, AddressNotFoundException;

    int enableAppUser(String email);

    void editWebsite(String website);

    void editDescription(String description);
}
