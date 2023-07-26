package com.altnative.Alt.Native.Service;

import com.altnative.Alt.Native.Exceptions.*;
import com.altnative.Alt.Native.Model.AddOn;
import com.altnative.Alt.Native.Model.Milestone;
import com.altnative.Alt.Native.Model.Order2;
import com.amazonaws.services.directory.model.UserDoesNotExistException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface Order2Service {

    public String retrieveInvoiceNumber(Long orderId) throws OrderNotFoundException, NoAccessRightsException;

    // Order2 createOrderForMarketplaceListing(Long marketplaceListingId, Order2 order) throws InvalidOrderException, MarketplaceListingNotFoundException;

    public Order2 retrieveOrderById(Long id) throws OrderNotFoundException, NoAccessRightsException;

    public List<Order2> retrieveAllOrders() throws OrderNotFoundException;

    public List<Order2> retrieveAllCompletedOrdersForPRandPL();

    // public List<Order2> retrieveOrdersFromMarketplaceListing(Long marketplaceListingId) throws MarketplaceListingNotFoundException;

    public List<AddOn> retrieveAddOnsByOrderId(Long orderId) throws OrderNotFoundException, NoAccessRightsException;

    public Order2 updateOrder(Order2 newOrder) throws OrderNotFoundException, NoAccessRightsException;

    public void deleteOrderAddOns(Long orderId, Long addOnId) throws OrderNotFoundException, AddOnNotFoundException, NoAccessRightsException;

    List<Order2> retrieveOwnRefashionerOrders();

    List<Order2> retrieveOwnRefashioneeOrders();

    List<Order2> retrieveOwnMplOrders();

    List<Order2> searchOwnRefashioneeOrders(Optional<String> status, Optional<String> keyword) throws OrderNotFoundException;

    List<Order2> searchOwnRefashionerOrders(Optional<String> status, Optional<String> keyword) throws OrderNotFoundException;

    public Order2 retrieveEventOrderById(Long id) throws OrderNotFoundException, NoAccessRightsException, UsernameNotFoundException;

    List<Order2> searchOwnSellerOrders(Optional<String[]> statuses, Optional<String> keyword);

    List<Order2> searchOwnMplOrders(Optional<String[]> statuses, Optional<String> keyword) throws OrderNotFoundException;

    List<Order2> searchOwnEventOrders(Optional<String[]> statuses, Optional<String> keyword) throws OrderNotFoundException;

    List<Order2> searchOwnBuyerOrders(Optional<String[]> statuses, Optional<String> keyword);

    Date retrieveProposedCompletionDate(Long orderId) throws OrderNotFoundException, NoAccessRightsException;

    int retrieveDaysLeftUntilCompletion(Long orderId) throws OrderNotFoundException, NoAccessRightsException;

    Order2 completeOrder(Long orderId) throws OrderNotFoundException, NoAccessRightsException;

    void requestProgressUpdate(Long orderId, Optional<String> remarks) throws UserDoesNotExistException, UsernameNotFoundException, OrderNotFoundException, NoAccessRightsException;

    void approveFinalProduct(Long orderId, Optional<String> remarks) throws OrderNotFoundException, NoAccessRightsException, UserDoesNotExistException, UsernameNotFoundException;

    void rejectFinalProduct(Long orderId, Optional<String> remarks) throws OrderNotFoundException, NoAccessRightsException, UserDoesNotExistException, UsernameNotFoundException, RejectFinalProductErrorException;

    Milestone addProgressUpdatePhotos(List<MultipartFile> files, Long orderId, Optional<String> remarks) throws UserDoesNotExistException, UsernameNotFoundException, OrderNotFoundException, NoAccessRightsException, InvalidFileException, S3Exception;

    Milestone addFinalApprovalUpdatePhotos(List<MultipartFile> files, Long orderId, Optional<String> remarks) throws OrderNotFoundException, InvalidFileException, S3Exception, NoAccessRightsException;

    // public AddOn createAddOnForOrder(Long orderId, AddOn addOn) throws OrderNotFoundException, UsernameNotFoundException;

    // public void deleteMarketplaceOrder(Long marketId, Long orderId) throws MarketplaceListingNotFoundException, OrderNotFoundException;


    //        public SessionCreateParams.LineItem.PriceData createPriceData(CheckoutItemDto checkoutItemDto);
//
//        public SessionCreateParams.LineItem createSessionLineItem(CheckoutItemDto checkoutItemDto);
//
//        public Session createSession(List<CheckoutItemDto> checkoutItemDtoList) throws StripeException;
}
