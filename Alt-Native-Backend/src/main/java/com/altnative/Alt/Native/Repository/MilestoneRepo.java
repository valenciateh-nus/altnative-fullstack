package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MilestoneRepo extends JpaRepository<Milestone, Long> {

    @Query("SELECT m FROM Milestone m WHERE m.offerId = (:offerId) ORDER BY m.date")
    public List<Milestone> findByOfferId(@Param("offerId") Long offerId);

    @Query("SELECT m FROM Milestone m WHERE m.addOnId = (:addOnId) ORDER BY m.date")
    public List<Milestone> findByAddOnId(@Param("addOnId") Long addOnId);

    List<Milestone> findByDisputeId(Long id);
}
