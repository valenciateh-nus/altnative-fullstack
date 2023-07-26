package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.AdminRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRecordRepo extends JpaRepository<AdminRecord, Long> {

}
