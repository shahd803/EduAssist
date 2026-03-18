package com.eduassist.eduassist.service;
import com.eduassist.eduassist.dto.ForgotPasswordRequest;
import com.eduassist.eduassist.dto.ResetPasswordRequest;
import com.eduassist.eduassist.entity.AppUser;
import com.eduassist.eduassist.entity.PasswordResetToken;
import com.eduassist.eduassist.repository.AppUserRepository;
import com.eduassist.eduassist.repository.PasswordResetTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Optional;


@Service
public class PasswordResetService {

    private final AppUserRepository userRepo;
    private final PasswordResetTokenRepository tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.reset.base-url}")
    private String resetBaseUrl;

    // token validity
    private static final long TOKEN_MINUTES = 20;

    public PasswordResetService(AppUserRepository userRepo,
                                PasswordResetTokenRepository tokenRepo,
                                PasswordEncoder passwordEncoder,
                                JavaMailSender mailSender) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest req) {

        Optional<AppUser> userOpt = userRepo.findByEmailIgnoreCase(req.email().trim());
        if (userOpt.isEmpty()) return;

        AppUser user = userOpt.get();

        String rawToken = generateToken();
        String tokenHash = sha256Hex(rawToken);


        PasswordResetToken prt = new PasswordResetToken();
        prt.setUser(user);
        prt.setTokenHash(tokenHash);
        prt.setExpiresAt(OffsetDateTime.now().plus(TOKEN_MINUTES, ChronoUnit.MINUTES));
        tokenRepo.save(prt);

        String link = resetBaseUrl + "/reset-password?token=" + rawToken;

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(user.getEmail());
        msg.setSubject("Reset your password");
        msg.setText("""
            We received a request to reset your password.

            Reset link (valid for %d minutes):
            %s

            If you didn’t request this, you can ignore this email.
            """.formatted(TOKEN_MINUTES, link));

        // DEV: don't crash if mail isn't configured yet
        try {
            mailSender.send(msg);
        } catch (Exception e) {
            System.out.println("MAIL ERROR (DEV): " + e.getMessage());
        }
    }


    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        String tokenHash = sha256Hex(req.token().trim());

        PasswordResetToken prt = tokenRepo.findTopByTokenHashOrderByCreatedAtDesc(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        if (prt.isUsed()) throw new IllegalArgumentException("Token already used");
        if (prt.getExpiresAt().isBefore(OffsetDateTime.now()))
            throw new IllegalArgumentException("Invalid or expired token");

        AppUser user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        userRepo.save(user);

        prt.setUsedAt(OffsetDateTime.now());
        tokenRepo.save(prt);
    }

    private static String generateToken() {
        // 32 bytes ~ 43 chars base64url (safe in URLs)
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Hashing failed", e);
        }
    }
}
