package com.eduassist.eduassist.controller;

import com.eduassist.eduassist.dto.ForgotPasswordRequest;
import com.eduassist.eduassist.dto.ResetPasswordRequest;
import com.eduassist.eduassist.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private final PasswordResetService service;

    public PasswordResetController(PasswordResetService service) {
        this.service = service;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@Valid @RequestBody ForgotPasswordRequest req) {
        service.forgotPassword(req);
        // Always return 200
        return ResponseEntity.ok().body("If the email exists, a reset link was sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@Valid @RequestBody ResetPasswordRequest req) {
        service.resetPassword(req);
        return ResponseEntity.ok().body("Password updated successfully.");
    }
}
