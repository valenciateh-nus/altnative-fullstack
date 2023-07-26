//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Exceptions.DeliveryInformationNotFoundException;
//import com.altnative.Alt.Native.Exceptions.InvalidDeliveryInformationException;
//import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
//import com.altnative.Alt.Native.Model.DeliveryInformation;
//
//import java.util.List;
//
//public interface DeliveryInformationService {
//
//    DeliveryInformation createDeliveryInformation(DeliveryInformation deliveryInformation) throws InvalidDeliveryInformationException;
//    public DeliveryInformation retrieveDeliveryInformationByTrackingNumber(String trackingNumber) throws DeliveryInformationNotFoundException, NoAccessRightsException;
//    public List<DeliveryInformation> retrieveAllDeliveryInformation();
//    public DeliveryInformation retrieveDeliveryInformationById(Long id) throws DeliveryInformationNotFoundException, NoAccessRightsException;
//    public String deleteDeliveryInformation(Long id) throws DeliveryInformationNotFoundException, NoAccessRightsException;
//    public DeliveryInformation updateDeliveryInformation(DeliveryInformation deliveryInformation) throws DeliveryInformationNotFoundException, NoAccessRightsException;
//}
