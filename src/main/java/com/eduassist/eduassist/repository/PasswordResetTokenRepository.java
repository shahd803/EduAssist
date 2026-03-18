package com.eduassist.eduassist.repository;
import com.eduassist.eduassist.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findTopByTokenHashOrderByCreatedAtDesc(String tokenHash);

    long deleteByExpiresAtBefore(OffsetDateTime cutoff);
}
