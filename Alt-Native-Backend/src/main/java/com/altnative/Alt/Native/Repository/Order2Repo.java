package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.OfferType;
import com.altnative.Alt.Native.Enum.OrderStatus;
import com.altnative.Alt.Native.Enum.RequestStatus;
import com.altnative.Alt.Native.Model.Order2;
import com.altnative.Alt.Native.Model.ProjectRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Order2Repo extends JpaRepository<Order2, Long> {

    Order2 findByOfferId(Long offerId);

    List<Order2> findByAppUserUsername(String username);

    List<Order2> findByRefashionerUsername(String username);

    List<Order2> findByAppUserUsernameAndOfferTypeIn(String username, List<OfferType> types);

    List<Order2> findByRefashionerUsernameAndOfferTypeIn(String username, List<OfferType> types);

    List<Order2> findBySellerUsernameAndOfferTypeIn(String username, List<OfferType> types);

    List<Order2> findByBuyerUsernameAndOfferTypeIn(String username, List<OfferType> types);

    List<Order2> findByRefashionerUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(String username, List<OfferType> types, String name);

    List<Order2> findByAppUserUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(String username, List<OfferType> types, String name);

    List<Order2> findByOrderStatusInAndOfferTypeInAndAppUserUsername(List<OrderStatus> statuses, List<OfferType> types, String username);

    List<Order2> findByOrderStatusInAndOfferTypeInAndRefashionerUsername(List<OrderStatus> statuses, List<OfferType> types, String username);

    List<Order2> findByOrderStatusInAndOfferTypeInAndRefashionerUsernameAndOfferTitleContainingIgnoreCase(List<OrderStatus> statuses, List<OfferType> types, String username, String name);

    List<Order2> findByOrderStatusInAndOfferTypeInAndAppUserUsernameAndOfferTitleContainingIgnoreCase(List<OrderStatus> statuses, List<OfferType> types, String username, String name);

    List<Order2> findBySellerUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(String username, List<OfferType> types, String name);

    List<Order2> findByBuyerUsernameAndOfferTypeInAndOfferTitleContainingIgnoreCase(String username, List<OfferType> types, String name);

    List<Order2> findByOrderStatusInAndOfferTypeInAndBuyerUsernameAndOfferTitleContainingIgnoreCase(List<OrderStatus> statuses, List<OfferType> types, String username, String name);

    List<Order2> findByOrderStatusInAndOfferTypeInAndSellerUsernameAndOfferTitleContainingIgnoreCase(List<OrderStatus> statuses, List<OfferType> types, String username, String name);

    List<Order2> findByOrderStatusInAndOfferTypeInAndBuyerUsername(List<OrderStatus> statuses, List<OfferType> types, String username);

    List<Order2> findByOrderStatusInAndOfferTypeInAndSellerUsername(List<OrderStatus> statuses, List<OfferType> types, String username);

}
