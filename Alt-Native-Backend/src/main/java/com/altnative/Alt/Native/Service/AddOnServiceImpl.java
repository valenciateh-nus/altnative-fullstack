package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.AddOnStatus;
import com.altnative.Alt.Native.Enum.Role;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.*;
import com.altnative.Alt.Native.Repository.AddOnRepo;
import com.altnative.Alt.Native.Repository.Order2Repo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AddOnServiceImpl implements AddOnService {
    private final AddOnRepo addOnRepo;
    private final AppUserService appUserService;
    private final Order2Repo order2Repo;
    private final Order2Service order2Service;
    private final UserService userService;
    private final OfferService offerService;

    @Override
    public AddOn retrieveAddOnById(Long id) throws AddOnNotFoundException, OfferNotFoundException, NoAccessRightsException {
        Optional<AddOn> addOn = addOnRepo.findById(id);

        if (addOn.isEmpty()) {
            log.info("Addon does not exist.");
            throw new AddOnNotFoundException("Addon not found, id: " + id);
        } else {
            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
            Long offerId = addOn.get().getOfferId();
            Offer offer = offerService.retrieveOfferById(offerId);
            String refashionee = offer.getRefashioneeUsername();
            AppUser refashioner = offer.getAppUser(); //refashioner of the entire order

            if (currUser.getUsername().equals(refashionee) || currUser.equals(refashioner) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                return addOn.get();
            }
            throw new NoAccessRightsException("You do not have access to this method!");

        }
    }

    //probably wont be needed
    @Override
    public List<AddOn> retrieveAllAddOns() throws AddOnNotFoundException {
        List<AddOn> addOns = new ArrayList<AddOn>();
        addOns = addOnRepo.findAll();
        if (addOns.isEmpty()) {
            throw new AddOnNotFoundException("There are no add ons.");
        } else {
            return addOns;
        }
    }

    @Override
    public AddOn updateAddOn(AddOn newAddOn) throws AddOnNotFoundException, OfferNotFoundException, NoAccessRightsException {
        Optional<AddOn> addOnOpt = addOnRepo.findById(newAddOn.getId());
        if (addOnOpt.isEmpty()) {
            throw new AddOnNotFoundException("Addon with id: " + newAddOn.getId() + " not found!");
        } else {
            AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
            Long offerId = addOnOpt.get().getOfferId();
            Offer offer = offerService.retrieveOfferById(offerId);
            String refashionee = offer.getRefashioneeUsername();
            AppUser refashioner = offer.getAppUser(); //refashioner of the entire order

            if (currUser.getUsername().equals(refashionee) || currUser.equals(refashioner) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
                AddOn addOn = addOnOpt.get();
                addOn.setTitle(newAddOn.getTitle());
                addOn.setDescription(newAddOn.getDescription());
                addOn.setPrice(newAddOn.getPrice());
                addOn.setProposedCompletionDate(newAddOn.getProposedCompletionDate());
                addOn.setAddOnStatus(newAddOn.getAddOnStatus());
                addOn.setOrderId(newAddOn.getOrderId());
                addOn.setOfferId(newAddOn.getOfferId());

                addOnRepo.save(addOn);
                return addOn;
            }
            throw new NoAccessRightsException("You do not have access to this method!");
        }
    }

    @Override
    public void deleteAddOn(Long addOnId) throws AddOnNotFoundException, NoAccessRightsException, OfferNotFoundException, OrderNotFoundException {
        AddOn addOn = retrieveAddOnById(addOnId);
        Order2 order = order2Service.retrieveOrderById(addOn.getOrderId());
        order.getAddOns().remove(addOn);
        addOnRepo.delete(addOn);
        addOnRepo.flush();
    }

    @Override
    public List<AddOn> retrieveAddOnsByOrderId(Long orderId) throws OrderNotFoundException, OfferNotFoundException, NoAccessRightsException {

        // retrieve order entity by id
        Order2 order = (Order2) order2Repo.findById(orderId).orElseThrow(
                () -> new OrderNotFoundException("Order id: " + orderId + " does not exist."));

        AppUser currUser = appUserService.getUser(userService.getCurrentUsername());
        Offer offer = offerService.retrieveOfferById(order.getOfferId());
        String refashionee = offer.getRefashioneeUsername();
        AppUser refashioner = offer.getAppUser(); //refashioner of the entire order

        if (currUser.getUsername().equals(refashionee) || currUser.equals(refashioner) || currUser.getRoles().contains(Role.valueOf("ADMIN"))) {
            if (order.getAddOns().isEmpty()) {
                return new ArrayList<>();
            }
            return order.getAddOns();
        }
        throw new NoAccessRightsException("You do not have access to this method!");
    }

    @Override
    public AddOn updateAddOnStatusByAddOnId(Long addOnId, AddOnStatus addOnStatus) throws AddOnNotFoundException, NoAccessRightsException, OfferNotFoundException {
        AddOn addOn = retrieveAddOnById(addOnId);
        addOn.setAddOnStatus(addOnStatus);
        addOnRepo.saveAndFlush(addOn);
        return addOn;
    }
}

