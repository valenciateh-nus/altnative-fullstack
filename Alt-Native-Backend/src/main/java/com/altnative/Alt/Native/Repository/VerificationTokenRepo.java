package com.altnative.Alt.Native.Repository;

import com.altnative.Alt.Native.Model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationTokenRepo extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);

    @Transactional
    @Modifying
    @Query("UPDATE VerificationToken v " +
            "SET v.confirmedAt = ?2 " +
            "WHERE v.token = ?1")
    int updateConfirmedAt(String token,
                          LocalDateTime confirmedAt);
}
