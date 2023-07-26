package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Enum.AddOnStatus;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AddOn;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface AddOnService {

    AddOn retrieveAddOnById(Long id) throws AddOnNotFoundException, OfferNotFoundException, NoAccessRightsException;

    List<AddOn> retrieveAllAddOns() throws AddOnNotFoundException;

    AddOn updateAddOn(AddOn newAddOn) throws AddOnNotFoundException, OfferNotFoundException, NoAccessRightsException;

    void deleteAddOn(Long addOnId) throws AddOnNotFoundException, NoAccessRightsException, OfferNotFoundException, OrderNotFoundException;

    List<AddOn> retrieveAddOnsByOrderId(Long orderId) throws OrderNotFoundException, OfferNotFoundException, NoAccessRightsException;

    AddOn updateAddOnStatusByAddOnId(Long addOnId, AddOnStatus addOnStatus) throws AddOnNotFoundException, NoAccessRightsException, OfferNotFoundException;
}
