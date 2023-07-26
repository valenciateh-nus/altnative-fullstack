package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.AddOn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddOnRepo extends JpaRepository<AddOn, Long> {
    List<AddOn> findByOrderId(Long orderId);
}