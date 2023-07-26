//package com.altnative.Alt.Native.Repository;
//
//import com.altnative.Alt.Native.Model.AddOnOrder;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.List;
//
//public interface AddOnOrderRepo extends JpaRepository<AddOnOrder, Long> {
//
//    @Query("SELECT a FROM AddOnOrder a WHERE a.addOnId = (:addOnId)")
//    public List<AddOnOrder> findByAddOnId(@Param("addOnId") Long addOnId);
//}
