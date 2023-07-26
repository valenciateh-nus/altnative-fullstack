package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.AccountStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Enum.S3BucketName;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.*;
import com.altnative.Alt.Native.Utility.SecurityUtility;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import lombok.extern.slf4j.Slf4j;
import com.stripe.model.Customer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.management.relation.InvalidRoleValueException;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Service
@Transactional
@Slf4j
public class AppUserServiceImpl implements AppUserService, UserDetailsService {

    private AppUserRepo appUserRepo;
    private PasswordEncoder passwordEncoder;
    private ImageService imageService;
    private ImageRepo imageRepo;
    private MeasurementRepo measurementRepo;
    private UserService userService;
    private EmailSender emailSender;
    private WalletRepo walletRepo;
//    private VerificationTokenService verificationTokenService;

    private final VerificationTokenRepo verificationTokenRepo;

    public AppUserServiceImpl(AppUserRepo appUserRepo, PasswordEncoder passwordEncoder, ImageService imageService,
                              MeasurementRepo measurementRepo, UserService userService,
                              @Value("${STRIPE_SECRET_KEY}") String secretKey, VerificationTokenRepo verificationTokenRepo, EmailSender emailSender, WalletRepo walletRepo) {

        this.appUserRepo = appUserRepo;
        this.passwordEncoder = passwordEncoder;
        this.imageService = imageService;
        this.measurementRepo = measurementRepo;
        this.userService = userService;
        // initialize Stripe API with secret key
        Stripe.apiKey = secretKey;
        this.verificationTokenRepo = verificationTokenRepo;
        this.emailSender = emailSender;
        this.walletRepo = walletRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = getUser(username);

        if (user != null && user.getAccountStatus() == AccountStatus.ACTIVE) {
            Collection<SimpleGrantedAuthority> auths = new ArrayList<>();
            user.getRoles().forEach(role -> {
                auths.add(new SimpleGrantedAuthority(role.name()));
            });
            return new User(user.getUsername(), user.getPassword(), auths);
        } else {
            throw new UsernameNotFoundException("Account has been deactivated");
        }
    }

    @Override
    public AppUser createUser(AppUser user, boolean isBusiness) throws UsernameExistsException, StripeException, MessagingException {

        AppUser exists = appUserRepo.findByUsername(user.getUsername());
        if (exists != null) {
            log.error("Username {} exists in db.", user.getUsername());
            throw new UsernameExistsException(user.getUsername());
        }
        AppUser newUser = new AppUser(user.getUsername(), user.getPassword(), user.getName(), user.getPhoneNumber());
        if (isBusiness) {
            newUser.setSite(user.getSite());
            newUser.setDescription(user.getDescription());
            newUser.addRole(Role.USER_BUSINESS.name());
        }
        Measurement m = new Measurement();
        measurementRepo.save(m);
        newUser.setMeasurement(m);
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        Customer customer = createCustomer(newUser);
        newUser.setCustomerId(customer.getId());

        log.info("Saving new user {} to db", newUser.getUsername());
        appUserRepo.save(newUser);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(
                token, LocalDateTime.now(), LocalDateTime.now().plusMinutes(15), newUser
        );
        verificationToken.setAppUser(newUser);
        verificationTokenRepo.save(verificationToken);

        Wallet wallet = new Wallet();
        wallet.setAppUser(newUser);
        walletRepo.save(wallet);
        newUser.setWallet(wallet);

        String link = "";
        if (!isBusiness) {
            link = "http://localhost:3000/verify/" + newUser.getId() + "?token=" + token;
        } else {
            link = "http://localhost:3002/verify/" + newUser.getId() + "?token=" + token;
        }
//        String link = "http://localhost:8080/api/v1/token/confirm?token=" + token;
        String content = emailSender.buildEmail(newUser.getName(), link);

        emailSender.sendmail(
                newUser.getUsername(), content);

        return newUser;
//        return appUserRepo.save(newUser);
    }

    @Override
    public AppUser createDummyUser(AppUser user, boolean isBusiness) throws UsernameExistsException, StripeException, MessagingException {

        AppUser exists = appUserRepo.findByUsername(user.getUsername());
        if (exists != null) {
            log.error("Username {} exists in db.", user.getUsername());
            throw new UsernameExistsException(user.getUsername());
        }
        AppUser newUser = new AppUser(user.getUsername(), user.getPassword(), user.getName(), user.getPhoneNumber(), user.getEnabled());
        if (isBusiness) {
            newUser.addRole(Role.USER_BUSINESS.name());
        }
        Measurement m = new Measurement();
        measurementRepo.save(m);
        newUser.setMeasurement(m);
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        Customer customer = createCustomer(newUser);
        newUser.setCustomerId(customer.getId());

        Wallet w = new Wallet();
        w.setAppUser(newUser);
        walletRepo.save(w);
        newUser.setWallet(w);

        log.info("Saving new user {} to db", newUser.getUsername());
        appUserRepo.save(newUser);


        //walletRepo.save(wallet);
        return newUser;
//        return appUserRepo.save(newUser);
    }

    @Override
    public AppUser createUserWithAvatar(AppUser user, Optional<MultipartFile> mpFile, boolean isBusiness) throws UsernameExistsException, InvalidFileException, S3Exception, NoAccessRightsException {
        AppUser exists = appUserRepo.findByUsername(user.getUsername());
        if (exists != null) {
            log.error("Username {} exists in db.", user.getUsername());
            throw new UsernameExistsException(user.getUsername());
        }
        AppUser newUser = new AppUser(user.getUsername(), user.getPassword(), user.getName(), user.getPhoneNumber());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        if (isBusiness) {
            newUser.addRole(Role.USER_BUSINESS.name());
        }
        if (mpFile.isPresent()) {
            String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), newUser.getId());
            String filename = String.format("%s-%s", UUID.randomUUID(), mpFile.get().getOriginalFilename());

            Image newImage = new Image();
            newImage.setPath(path);
            newImage.setFileName(filename);
            newImage = imageService.createImage(newImage, mpFile.get());
            newUser.setAvatar(newImage);
        }
        appUserRepo.save(newUser);
        log.info("Saving new user {} to db", newUser.getUsername());
        return appUserRepo.save(newUser);
    }

    @Override
    public Customer createCustomer(AppUser user) throws StripeException {
        Map<String, Object> customerParams = new HashMap<String, Object>();
        customerParams.put("name", user.getName());
        customerParams.put("email", user.getUsername());
        return Customer.create(customerParams);
    }

    @Override
    public Customer getCustomer(String id) throws StripeException {
        return Customer.retrieve(id);
    }

    @Override
    public void addRole(String username, String roleName) throws UsernameNotFoundException, InvalidRoleValueException, NoAccessRightsException {
        System.out.println("GETS HERE");
        try {
            Role.valueOf(roleName);
        } catch (IllegalArgumentException ex) {
            log.info("Invalid role name {}", roleName);
            throw new InvalidRoleValueException(roleName + " is invalid.");
        }
        AppUser oldUser = appUserRepo.findByUsername(username);
        if (oldUser == null) {
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

//        AppUser currUser = getUser(userService.getCurrentUsername());
//        if (!currUser.getRoles().contains(Role.ADMIN)) {
//            throw new NoAccessRightsException("You do not have the access rights for this method!");
//        }

        log.info("Changing user {} role to {}.", username, roleName);
        oldUser.getRoles().add(Role.valueOf(roleName));
        appUserRepo.save(oldUser);
    }

    @Override
    public AppUser getUser(String username) throws UsernameNotFoundException {
        AppUser user = appUserRepo.findByUsername(username);
        if (user == null) {
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

        return user;
    }

    @Override
    public AppUser getUserById(Long id) throws UserDoesNotExistException {
        Optional<AppUser> user = appUserRepo.findById(id);
        if (user.isEmpty()) {
            throw new UserDoesNotExistException("User with id: " + id + " does not exist.");
        } else {
            return user.get();
        }
    }

    @Override
    public List<AppUser> getUsers() {
        return appUserRepo.findAll();
    }

    // admin searches for a user
    // filter by account status AND/OR name/username/email
    @Override
    public List<AppUser> searchUsers(Optional<String[]> roles, Optional<String[]> statuses, Optional<String> keyword) {
        AppUser loggedInUser = getUser(userService.getCurrentUsername());
        Set<AppUser> appUsers = new HashSet<>();
        List<AccountStatus> statuses1 = new ArrayList<>();
        if (statuses.isPresent()) {
            List<String> statusStr = Arrays.asList(statuses.get());
            for (String s : statusStr) {
                statuses1.add(AccountStatus.valueOf(s));
            }
        }
        if (roles.isPresent()) {
            List<String> roleStr = Arrays.asList(roles.get());
            List<Role> roles1 = new ArrayList<>();
            for (String s : roleStr) {
                roles1.add(Role.valueOf(s));
            }
            if (statuses.isEmpty() && keyword.isEmpty()) {
                appUsers.addAll(appUserRepo.findByRolesIn(roles1));
            } else if (statuses.isPresent() && keyword.isEmpty()) {
                appUsers.addAll(appUserRepo.findByRolesInAndAccountStatusIn(roles1, statuses1));
            } else if (statuses.isEmpty() && keyword.isPresent()) {
                appUsers.addAll(appUserRepo.findByRolesInAndNameContainingIgnoreCase(roles1, keyword.get()));
                appUsers.addAll(appUserRepo.findByRolesInAndUsernameContainingIgnoreCase(roles1, keyword.get()));
            } else if (statuses.isPresent() && keyword.isPresent()) {
                appUsers.addAll(appUserRepo.findByRolesInAndAccountStatusInAndNameContainingIgnoreCase(roles1, statuses1, keyword.get()));
                appUsers.addAll(appUserRepo.findByRolesInAndAccountStatusInAndUsernameContainingIgnoreCase(roles1, statuses1, keyword.get()));
            }
        } else {
            if (statuses.isPresent()) {
                if (keyword.isEmpty()) {
                    appUsers.addAll(appUserRepo.findByAccountStatusIn(statuses1));
                } else {
                    appUsers.addAll(appUserRepo.findByAccountStatusInAndNameContainingIgnoreCase(statuses1, keyword.get()));
                    appUsers.addAll(appUserRepo.findByAccountStatusInAndUsernameContainingIgnoreCase(statuses1, keyword.get()));
                }
            } else {
                if (keyword.isPresent()) {
                    appUsers.addAll(appUserRepo.findByNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(keyword.get(), keyword.get()));
                }
            }
        }
        List<AppUser> appUsers2 = new ArrayList<>();
        for (AppUser a : appUsers) {
            if (!a.getRoles().contains(Role.valueOf("ADMIN"))) {
                appUsers2.add(a);
            }
        }
        return appUsers2;
    }

    @Override
    public Image uploadAvatar(AppUser user, MultipartFile file) throws
            InvalidFileException, S3Exception, NoAccessRightsException {
        log.info("Current User: {}", user.getUsername());
        AppUser currUser = getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getId() == user.getId()) {
            String path = String.format("%s/%s", S3BucketName.ALTNATIVE_MEDIA.getBucketName(), user.getId());
            String filename = String.format("%s-%s", UUID.randomUUID(), file.getOriginalFilename());

            if (user.getAvatar() != null) {
                Image toDelete = user.getAvatar();
                user.setAvatar(null);
                imageService.deleteImage(toDelete);
            }
            Image newImage = imageService.createImage(currUser, file);
            user.setAvatar(newImage);
            appUserRepo.save(user);

            return newImage;
        } else {
            throw new NoAccessRightsException("You do not have the access rights for this method!");
        }
    }

    @Override
    public void removeAvatar(AppUser user) throws NoAccessRightsException {
        log.info("Current User: {}", user.getUsername());
        AppUser currUser = getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getId() == user.getId()) {
            Image avatar = currUser.getAvatar();
            user.setAvatar(null);
            appUserRepo.save(user);
            imageService.deleteImage(avatar);
        } else {
            throw new NoAccessRightsException("You do not have the access rights to do this method!");
        }
    }

    @Override
    public AppUser getUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            DecodedJWT decodedJWT = SecurityUtility.decode_token(token);
            String username = decodedJWT.getSubject();
            AppUser user = getUser(username);
            return user;
        } else {
            throw new RuntimeException("Token is missing");
        }
    }

    @Override
    public void suspendUser(String username) throws
            UsernameNotFoundException, AccountStatusCannotBeModifiedException, NoAccessRightsException {
        AppUser user = getUser(username);

        if (user == null) { //user does not exist
            throw new UsernameNotFoundException("User :" + username + " does not exist.");
        }

        AppUser currUser = getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            AccountStatus accountStatus = user.getAccountStatus();
            if (accountStatus == AccountStatus.SUSPENDED) {
                log.info("User: {} is already suspended", user.getUsername());
            } else if (accountStatus == AccountStatus.DELETED) {
                throw new AccountStatusCannotBeModifiedException("User :" + username + " has already been deleted."); //account already deleted
            } else {
                user.setAccountStatus(AccountStatus.SUSPENDED);
                log.info("User: {} has been suspended", user.getUsername());
            }
            appUserRepo.save(user);
        } else {
            throw new NoAccessRightsException("You do not have the access rights for this method!");
        }
    }

    @Override
    public void unblockUser(String username) throws
            UsernameNotFoundException, AccountStatusCannotBeModifiedException, NoAccessRightsException { //only used by admins
        AppUser user = getUser(username);

        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

        AppUser currUser = getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            AccountStatus accountStatus = user.getAccountStatus();
            if (accountStatus == AccountStatus.DELETED) {
                throw new AccountStatusCannotBeModifiedException("User: " + username + " has been deactivated.");
            } else if (accountStatus == AccountStatus.ACTIVE) {
                log.info("User: {} is already active", user.getUsername());
            } else { //for suspended users only
                user.setAccountStatus(AccountStatus.ACTIVE);
                log.info("User: {} has been unblocked", user.getUsername());
            }
            appUserRepo.save(user);
        } else {
            throw new NoAccessRightsException("You do not have the access rights for this method!");
        }
    }

    @Override
    public void deactivateUser(String username) throws
            UsernameNotFoundException, DeactivatedAccountException, NoAccessRightsException {
        AppUser user = getUser(username);

        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

        AppUser currUser = getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getUsername().equals(username)) {
            AccountStatus accountStatus = user.getAccountStatus();
            if (accountStatus == AccountStatus.DELETED) {
                throw new DeactivatedAccountException("User:" + username + " has already been deactivated.");
            } else {
                user.setStatusDate(new Date()); //set as today's date
                user.setAccountStatus(AccountStatus.DELETED); //both type of users (active and suspended) can be deleted
                log.info("User: {} has been successfully deleted", user.getUsername());
            }
            appUserRepo.save(user);
        } else {
            throw new NoAccessRightsException("You do not have the access rights for this method!");
        }
    }

    @Override
    public void reactivateUser(String username) throws
            UsernameNotFoundException, DeactivatedAccountException, AccountStatusCannotBeModifiedException {
        AppUser user = getUser(username);

        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException("User: " + username + " does not exist.");
        }
        AccountStatus accountStatus = user.getAccountStatus();
        //if the user's account was not deleted
        if (accountStatus != AccountStatus.DELETED) { //Two statuses: Active, Suspended
            throw new AccountStatusCannotBeModifiedException("User: " + username + "'s account currently has status " + accountStatus + " and cannot be reactivated.");
        }
        //Deleted means user deactivated themselves: count number of days allowed
        Date currTime = new Date();
        long diff = user.getStatusDate().getTime() - currTime.getTime();
        if (TimeUnit.DAYS.convert(diff, TimeUnit.DAYS) > 20) { //cannot reactivate pass 20 days
            throw new DeactivatedAccountException("You can no longer reactivate this account as it has been more than 20 days.");
        } else {
            user.setAccountStatus(AccountStatus.ACTIVE); //both type of users (active and suspended) can be deleted
            log.info("User: {} has been reactivated", user.getUsername());
        }
        appUserRepo.save(user);
    }

    @Override
    public void editUsername(String username, String newUsername) throws
            UsernameNotFoundException, UsernameExistsException, NoAccessRightsException {
        AppUser user = getUser(username);

        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException("User: " + username + " does not exist.");
        }

        AppUser currUser = getUser(userService.getCurrentUsername());

        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getUsername().equals(username)) {
            AppUser anotherUser = appUserRepo.findByUsername(newUsername); //find if user with new username exists
            if (anotherUser == null) {
                user.setUsername(newUsername);
            } else {
                log.error("User {} already exists. Please choose another username", newUsername);
                throw new UsernameExistsException(newUsername + " already exists");
            }
            appUserRepo.save(user);
        } else {
            throw new NoAccessRightsException("You do not have the access rights for this method!");
        }
    }

    @Override
    public AppUser editPassword(String username, String currPassword, String newPassword) throws
            UsernameNotFoundException, NoAccessRightsException, InvalidPasswordException {

        AppUser user = getUser(username);

        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

        AppUser currUser = getUser(userService.getCurrentUsername());
        if (passwordEncoder.matches(currPassword, user.getPassword())) {
            if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getUsername().equals(username)) {
                if (passwordEncoder.matches(newPassword, user.getPassword())) {
                    log.info("Current password is the same as previous.");
                    throw new NoAccessRightsException("Please use a different password.");
                } else {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    log.info("Password changed.");
                }
                appUserRepo.save(user);
                return user;
            } else {
                throw new NoAccessRightsException("You do not have the access rights for this method!");
            }
        } else {
            throw new InvalidPasswordException("Your password is incorrect!");
        }

    }

    @Override
    public AppUser editPasswordDirectly(String username, String newPassword) {
        AppUser user = getUser(username);

        if (user == null) {
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        log.info("Password changed.");
        appUserRepo.save(user);
        return user;
    }

    @Override
    public void editName(String username, String newName) throws UsernameNotFoundException, NoAccessRightsException {
        AppUser user = getUser(username);

        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

        AppUser currUser = getUser(userService.getCurrentUsername());

        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getUsername().equals(username)) {
            if (user.getName().equals(newName)) {
                log.info("Current name is the same as previous.");
            } else {
                user.setName(newName);
                log.info("Name changed to: " + newName);
            }
            appUserRepo.save(user);
        } else {
            throw new NoAccessRightsException("You do not have the access rights for this method!");
        }
    }

    @Override
    public void editPhoneNumber(String username, String newPhone) throws
            UsernameNotFoundException, NoAccessRightsException {
        AppUser user = getUser(username);

        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

        AppUser currUser = getUser(userService.getCurrentUsername());

        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getUsername().equals(username)) {
            if (user.getPhoneNumber().equals(newPhone)) {
                log.info("Current phone number is the same as previous.");
            } else {
                user.setPhoneNumber(newPhone);
                log.info("Phone Number changed to: " + newPhone);
            }
            appUserRepo.save(user);
        } else {
            throw new NoAccessRightsException("You do not have the access rights for this method!");
        }
    }

    @Override
    public AppUser viewProfile() throws UsernameNotFoundException {
        AppUser appUser = getUser(userService.getCurrentUsername());
        return appUser;
    }

    @Override
    public void addDeliveryAddress(String username, String address) throws
            UsernameNotFoundException, NoAccessRightsException {
        AppUser user = getUser(username);
        if (user == null) { //user does not exist
            log.error("User {} does not exist.", username);
            throw new UsernameNotFoundException(username + " does not exist.");
        }

        AppUser currUser = getUser(userService.getCurrentUsername());
        if (currUser.getRoles().contains(Role.valueOf("ADMIN")) || currUser.getUsername().equals(username)) {
            user.setAddress(address);
            log.info("Address changed to: " + address);
            appUserRepo.save(user);
        } else {
            throw new NoAccessRightsException("You do not have the access rights for this method!");
        }
    }

    @Override
    public String getDeliveryAddressByUsername(String username) throws
            UserDoesNotExistException, AddressNotFoundException {
        AppUser user = getUser(username);
        if (user.getAddress() == null || user.getAddress().equalsIgnoreCase("")) {
            throw new AddressNotFoundException("The user has not added their address yet!");
        } else {
            return user.getAddress();
        }
    }

    @Override
    public String getDeliveryAddressByUserId(Long id) throws UserDoesNotExistException, AddressNotFoundException {
        AppUser user = getUserById(id);
        if (user.getAddress() == null || user.getAddress().equalsIgnoreCase("")) {
            throw new AddressNotFoundException("The user has not added their address yet!");
        } else {
            return user.getAddress();
        }
    }

    @Override
    public int enableAppUser(String email) {
        return appUserRepo.enableAppUser(email);
    }

    @Override
    public void editWebsite(String website) {
        AppUser currUser = getUser(userService.getCurrentUsername());
        currUser.setSite(website);
        appUserRepo.save(currUser);
    }

    @Override
    public void editDescription(String description) {
        AppUser currUser = getUser(userService.getCurrentUsername());
        currUser.setDescription(description);
        appUserRepo.save(currUser);
    }
}