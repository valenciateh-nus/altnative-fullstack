package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Dto.DeliveryForm;
import com.altnative.Alt.Native.Dto.jnt.Tracking;
import com.altnative.Alt.Native.Exceptions.DeliveryNotFoundException;
import com.altnative.Alt.Native.Exceptions.NoAccessRightsException;
import com.altnative.Alt.Native.Exceptions.NoDeliveryExistsException;
import com.altnative.Alt.Native.Exceptions.OrderNotFoundException;
import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.Delivery;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.List;

public interface DeliveryService {

//    Delivery createDelivery(Long orderId) throws OrderNotFoundException, NoAccessRightsException;

    Delivery createDelivery(Long orderId, DeliveryForm deliveryForm) throws OrderNotFoundException, NoAccessRightsException;

    Delivery createDeliveryForSwapItem(Long swapItemId, DeliveryForm deliveryForm) throws ItemNotFoundException, NoAccessRightsException, OrderNotFoundException;

    Delivery createDeliveryForSwapRequest(Long swapRequestId, DeliveryForm deliveryForm) throws SwapRequestNotFoundException, NoAccessRightsException;

    Delivery updateCourierByDeliveryId(String courierName, Long deliveryId, Long orderId) throws OrderNotFoundException, NoAccessRightsException, DeliveryNotFoundException;

    Delivery retrieveDeliveryById(Long deliveryId) throws DeliveryNotFoundException;

    List<Delivery> retrieveDeliveriesInOrder(Long orderId) throws OrderNotFoundException, NoAccessRightsException, NoDeliveryExistsException;

    void deleteDeliveryByDeliveryId(Long deliveryId) throws DeliveryNotFoundException;

    Delivery updateDelivery(Delivery delivery) throws DeliveryNotFoundException;

    List<Delivery> retrieveAllDeliveriesByCourier(String courierName) throws NoDeliveryExistsException;

    Flux<String> fetchLockerStationList(String token);

    Flux<String> fetchDistributionPoints(String token, String service_code);

    List<String> fetchDistributionPointsAsList(String token, String service_code);

    String createJNTDelivery(String token, Long deliveryId) throws DeliveryNotFoundException, JNTDeliveryCreationError;

    //probably wont be used
    Flux<String> schedulePickup(String token, Long deliveryId, String jntTrackingId) throws DeliveryNotFoundException;

    Flux<String> getServicePricing(String token, Double weight, Double length, Double width, Double height);

    Mono<Tracking> getJNTStatus(String token, Long deliveryId) throws DeliveryNotFoundException;

    String getJNTInvoice(String token, String jntTrackingId);
}
