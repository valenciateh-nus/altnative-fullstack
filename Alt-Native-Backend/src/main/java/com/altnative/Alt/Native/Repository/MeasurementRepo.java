package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasurementRepo extends JpaRepository<Measurement, Long> {
}
