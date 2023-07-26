package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepo extends JpaRepository<Delivery, Long> {
    public List<Delivery> findAllByCourierName(String courierName);
}
