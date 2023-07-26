//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Model.AddOn;
//import com.altnative.Alt.Native.Model.AddOnOrder;
//
//import java.util.List;
//
//public interface AddOnOrderService {
//
//    String retrieveInvoiceNumber(Long addOnOrderId) throws AddOnOrderNotFoundException, NoAccessRightsException, OfferNotFoundException;
//
//    AddOnOrder retrieveAddOnOrderById(Long id) throws AddOnOrderNotFoundException, NoAccessRightsException, OfferNotFoundException;
//
//    List<AddOnOrder> retrieveAllAddOnOrders();
//
////    public List<AddOn> retrieveAddOnsByAddOnOrderId(Long addOnOrderId) throws AddOnOrderNotFoundException;
//
//    AddOnOrder updateAddOnOrder(AddOnOrder newAddOnOrder) throws AddOnOrderNotFoundException, NoAccessRightsException, OfferNotFoundException;
//
////    public void deleteAddOnOrderAddOns(Long addOnOrderId, Long addOnId) throws AddOnOrderNotFoundException, AddOnNotFoundException;
//
//    AddOnOrder completeAddOnOrder(Long addOnOrderId) throws AddOnOrderNotFoundException, NoAccessRightsException;
//
//}
