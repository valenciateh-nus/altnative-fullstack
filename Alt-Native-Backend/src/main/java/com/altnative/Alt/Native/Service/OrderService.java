//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Model.AddOn;
//import com.altnative.Alt.Native.Model.Order;
//
//import java.util.List;
//
//public interface OrderService {
//
//    Order createOrderForOffer(Long offerId, Order order) throws InvalidOrderException, OfferNotFoundException, InvalidOfferException;
//
//    Order createOrderForMarketplaceListing(Long marketplaceListingId, Order order) throws InvalidOrderException, MarketplaceListingNotFoundException;
//
//    public Order retrieveOrderById(Long id) throws OrderNotFoundException;
//
//    public List<Order> retrieveAllOrders();
//
//    public List<Order> retrieveOrdersFromMarketplaceListing(Long marketplaceListingId) throws MarketplaceListingNotFoundException;
//
//    public List<AddOn> retrieveAddOnsByOrderId(Long orderId) throws OrderNotFoundException;
//
//    public Order updateOrder(Order newOrder) throws OrderNotFoundException;
//
//    public void deleteMarketplaceOrder(Long marketId, Long orderId) throws MarketplaceListingNotFoundException, OrderNotFoundException;
//
//    public void deleteOrderAddOns(Long orderId, Long addOnId) throws OrderNotFoundException, AddOnNotFoundException;
//
//}
