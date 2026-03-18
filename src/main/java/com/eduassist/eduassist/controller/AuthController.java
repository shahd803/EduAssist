package com.eduassist.eduassist.controller;

import com.eduassist.eduassist.dto.LoginRequest;
import com.eduassist.eduassist.dto.SignupRequest;
import com.eduassist.eduassist.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        authService.signup(request);

        // Optional: return a message as JSON (easier for frontend)
        return ResponseEntity.ok(Map.of("message", "User created"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request.getEmail(), request.getPassword());

        // Return token in JSON so Postman/frontend can read it easily
        return ResponseEntity.ok(Map.of("token", token));
    }
}
