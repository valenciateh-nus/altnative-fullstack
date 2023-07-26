package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Enum.DisputeStatus;
import com.altnative.Alt.Native.Model.Dispute;
import com.altnative.Alt.Native.Model.RefashionerRegistrationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface RefashionerRegistrationRequestRepo extends JpaRepository<RefashionerRegistrationRequest, Long> {

    List<RefashionerRegistrationRequest> findByUserId(Long userId);
    List<RefashionerRegistrationRequest> findAllByVerifiedDateBetweenAndAndVerifiedTrue(
            Date timeStart,
            Date timeEnd);
}
