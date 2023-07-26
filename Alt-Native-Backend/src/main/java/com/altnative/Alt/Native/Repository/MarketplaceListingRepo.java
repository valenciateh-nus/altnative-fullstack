package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.MarketplaceListingStatus;
import com.altnative.Alt.Native.Model.MarketplaceListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MarketplaceListingRepo extends JpaRepository<MarketplaceListing, Long> {

//    @Query("SELECT m FROM MarketplaceListing m JOIN FETCH m.orders WHERE m.id = (:id)")
//    public MarketplaceListing findByIdAndFetchOrdersEagerly(@Param("id") Long id);
//
//    @Query("SELECT m FROM MarketplaceListing m WHERE :order MEMBER OF m.orders")
//    public List<MarketplaceListing> findMarketplaceListingsWithOrder(@Param("order") Order2 order);

    List<MarketplaceListing> findByCategoryId(Long cId);

    List<MarketplaceListing> findByMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByMarketplaceListingStatusInAndIsAvailableTrue(List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByMarketplaceListingStatusInAndIsDeadstockFalse(List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByMarketplaceListingStatusInAndIsDeadstockTrue(List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrue(String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockFalse(String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrue(String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(String title, List<MarketplaceListingStatus> statuses);

    @Query("SELECT m FROM MarketplaceListing m WHERE m.description LIKE '%description%' AND m.isAvailable IS TRUE")
    List<MarketplaceListing> findByDescription(String description);

    List<MarketplaceListing> findByAppUserUsernameAndIsAvailableTrue(String username);

    List<MarketplaceListing> findByCategoryIdInAndAppUserUsernameAndIsAvailableTrue(List<Long> cIds, String username);

    @Query("SELECT m FROM MarketplaceListing m JOIN m.appUser a WHERE a.username = ?1 AND m.title like lower(concat('%', ?2,'%')) AND m.isAvailable IS TRUE")
    List<MarketplaceListing> findByAppUserUsernameAndTitleContainingIgnoreCase(String username, String title);

    List<MarketplaceListing> findByAppUserUsernameAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(String username, String name);

    List<MarketplaceListing> findByCategoryIdInAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(List<Long> cIds, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndMarketplaceListingStatusInAndIsAvailableTrue(List<Long> cIds, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(List<Long> cIds, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndMarketplaceListingStatusInAndIsDeadstockFalse(List<Long> cIds, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndMarketplaceListingStatusInAndIsDeadstockTrue(List<Long> cIds, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(List<Long> cIds, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrue(String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockFalse(String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrue(String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(List<Long> cIds, String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrue(List<Long> cIds, String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(List<Long> cIds, String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockFalse(List<Long> cIds, String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrue(List<Long> cIds, String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndCategoryCategoryNameContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(List<Long> cIds, String name, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockFalse(List<Long> cIds, String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrue(List<Long> cIds, String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsAvailableTrueAndIsDeadstockTrue(List<Long> cIds, String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockFalse(List<Long> cIds, String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrue(List<Long> cIds, String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByCategoryIdInAndTitleContainingIgnoreCaseAndMarketplaceListingStatusInAndIsDeadstockTrueAndIsAvailableTrue(List<Long> cIds, String title, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByAppUserUsernameAndMarketplaceListingStatusInAndIsAvailableTrue(String username, List<MarketplaceListingStatus> statuses);

    List<MarketplaceListing> findByAppUserUsernameAndMarketplaceListingStatusInAndTitleContainingIgnoreCaseAndIsAvailableTrue(String username, List<MarketplaceListingStatus> statuses, String title);

    List<MarketplaceListing> findByAppUserUsernameAndMarketplaceListingStatusInAndCategoryCategoryNameContainingIgnoreCaseAndIsAvailableTrue(String username, List<MarketplaceListingStatus> statuses, String name);



}