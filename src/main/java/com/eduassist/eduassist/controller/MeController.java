package com.eduassist.eduassist.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MeController {

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        return Map.of(
                "authenticated", auth != null && auth.isAuthenticated(),
                "email", auth != null ? auth.getName() : null
        );
    }
}
