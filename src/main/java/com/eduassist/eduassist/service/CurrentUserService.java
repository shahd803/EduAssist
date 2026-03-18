package com.eduassist.eduassist.service;

import com.eduassist.eduassist.entity.AppUser;
import com.eduassist.eduassist.repository.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final AppUserRepository userRepository;

    public CurrentUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AppUser getCurrentUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("Unauthenticated");
        }

        String email = auth.getName(); // we put email as the principal in JwtAuthFilter
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }
}

