//package com.altnative.Alt.Native.Service;
//
//import com.altnative.Alt.Native.Exceptions.*;
//import com.altnative.Alt.Native.Exceptions.OrderNotFoundException;
//import com.altnative.Alt.Native.Model.*;
//import com.altnative.Alt.Native.Repository.*;
//import com.altnative.Alt.Native.Repository.OrderRepo;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import javax.transaction.Transactional;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//@Slf4j
//public class OrderServiceImpl implements OrderService {
//
//    private final OfferRepo offerRepo;
//    private final OrderRepo orderRepo;
//    private final AddOnRepo addOnRepo;
//    private final MarketplaceListingRepo marketplaceListingRepo;
//
//    @Override
//    public Order createOrderForOffer(Long offerId, Order order) throws InvalidOrderException, OfferNotFoundException, InvalidOfferException {
//
//        Offer offer = offerRepo.findById(offerId).orElseThrow(() ->
//                new InvalidOfferException("Offer id: " + offerId + " does not exist."));
//        log.info("Offer id: " + offer.getId());
//
//        Order newOrder = new Order(order.getPrice(), offer);
//        log.info("Order status: " + newOrder.getOrderStatus());
//        log.info("Order id: " + newOrder.getId());
//
//        newOrder.setOffer(offer);
//        // order entity to DB
//        log.info("Saving new order {} to db");
//        orderRepo.save(newOrder);
//        return newOrder;
//
//    }
//
//    @Override
//    public Order createOrderForMarketplaceListing(Long marketplaceListingId, Order order) throws InvalidOrderException, MarketplaceListingNotFoundException {
//
//        MarketplaceListing marketplaceListing = (MarketplaceListing) marketplaceListingRepo.findById(marketplaceListingId).orElseThrow(
//                () -> new MarketplaceListingNotFoundException("Marketplace Listing with id: " + marketplaceListingId + " does not exist."));
//
//        if (!order.getMarketplaceListings().contains(marketplaceListing)) {
//            order.getMarketplaceListings().add(marketplaceListing);
//            marketplaceListing.getOrders().add(order);
//        }
//
//        log.info("Saving new offer {} to db", order.getId());
//        orderRepo.save(order);
//        return order;
//
//    }
//
//    @Override
//    public Order retrieveOrderById(Long id) throws OrderNotFoundException {
//        Optional<Order> order = orderRepo.findById(id);
//
//        if (order.isEmpty()) {
//            log.info("Order does not exist.");
//            throw new OrderNotFoundException("Order not found, id: " + id);
//        } else {
//            return order.get();
//        }
//    }
//
//    @Override
//    public List<Order> retrieveAllOrders() {
//        return orderRepo.findAll();
//    }
//
//    @Override
//    public List<Order> retrieveOrdersFromMarketplaceListing(Long marketplaceListingId) throws MarketplaceListingNotFoundException {
//
//        MarketplaceListing marketplaceListing = (MarketplaceListing) marketplaceListingRepo.findById(marketplaceListingId).orElseThrow(
//                () -> new MarketplaceListingNotFoundException("Marketplace Listing with id: " + marketplaceListingId + " does not exist."));
//
//        List<Order> orders = marketplaceListing.getOrders();
//        return orders;
//    }
//
//    @Override
//    public List<AddOn> retrieveAddOnsByOrderId(Long orderId) throws OrderNotFoundException {
//        Optional<Order> order = orderRepo.findById(orderId);
//
//        if (order.isEmpty()) {
//            log.info("Order does not exist.");
//            throw new OrderNotFoundException("Order not found, id: " + orderId);
//        } else {
//            List<AddOn> addOns = order.get().getAddOns();
//            return addOns;
//        }
//    }
//
//    @Override
//    public Order updateOrder(Order newOrder) throws OrderNotFoundException {
//        Optional<Order> order = orderRepo.findById(newOrder.getId());
//        if (order.isEmpty()) {
//            throw new OrderNotFoundException("Order listing with id: " + newOrder.getId() + " not found!");
//        } else {
//            Order orderToUpdate = order.get();
//            orderToUpdate.setOrderStatus(newOrder.getOrderStatus());
//            orderToUpdate.setPrice(newOrder.getPrice());
//            orderToUpdate.setOffer(newOrder.getOffer());
//            orderToUpdate.setAddOns(newOrder.getAddOns());
//
//            orderRepo.save(orderToUpdate);
//            return orderToUpdate;
//        }
//    }
//
//    @Override
//    public void deleteMarketplaceOrder(Long marketId, Long orderId) throws MarketplaceListingNotFoundException, OrderNotFoundException {
//        Optional<Order> order = orderRepo.findById(orderId);
//        if (order.isEmpty()) {
//            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
//        } else {
//            Order orderToDelete = order.get();
//
//            MarketplaceListing marketplaceListing = marketplaceListingRepo.findById(marketId).orElseThrow(
//                    () -> new MarketplaceListingNotFoundException("Marketplace Listing id: " + marketId + " does not exist."));
//
//            marketplaceListing.getOrders().remove(orderToDelete);
//
//            List<MarketplaceListing> marketplaceListings = marketplaceListingRepo.findMarketplaceListingsWithOrder(orderToDelete);
//
//            if (marketplaceListings.size() == 0) {
//                orderRepo.delete(orderToDelete);
//                orderRepo.flush();
//            }
//        }
//
//    }
//
//    @Override
//    public void deleteOrderAddOns(Long orderId, Long addOnId) throws OrderNotFoundException, AddOnNotFoundException {
//        Optional<Order> order = orderRepo.findById(orderId);
//
//        if (order.isEmpty()) {
//            throw new OrderNotFoundException("Order with id: " + orderId + " not found!");
//        } else {
//            List<AddOn> addOns = order.get().getAddOns();
//            AddOn addOnToDelete = addOnRepo.findById(addOnId).orElseThrow(
//                () -> new AddOnNotFoundException("Add on id: " + addOnId + " does not exist."));
//            addOns.remove(addOnToDelete);
//
//            addOnRepo.delete(addOnToDelete);
//            addOnRepo.flush();
//        }
//    }
//}
