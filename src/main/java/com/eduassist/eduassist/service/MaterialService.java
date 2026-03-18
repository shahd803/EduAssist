package com.eduassist.eduassist.service;

import com.eduassist.eduassist.dto.MaterialRequest;
import com.eduassist.eduassist.entity.AppUser;
import com.eduassist.eduassist.entity.Material;
import com.eduassist.eduassist.repository.MaterialRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CurrentUserService currentUserService;

    public MaterialService(MaterialRepository materialRepository,
                           CurrentUserService currentUserService) {
        this.materialRepository = materialRepository;
        this.currentUserService = currentUserService;
    }

    public Material createMaterial(MaterialRequest req, Authentication auth) {

        if (req.getTitle() == null || req.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }

        if (req.getMaterialType() == null) {
            throw new IllegalArgumentException("Material type is required");
        }

        // TEXT validation
        if (req.getMaterialType() == MaterialRequest.MaterialType.TEXT) {

            if (req.getContentText() == null || req.getContentText().isBlank()) {
                throw new IllegalArgumentException(
                        "contentText is required for TEXT materials");
            }

            req.setFileUrl(null);
        }

        // PDF or LINK validation
        else {

            if (req.getFileUrl() == null || req.getFileUrl().isBlank()) {
                throw new IllegalArgumentException(
                        "fileUrl is required for PDF/LINK materials");
            }

            req.setContentText(null);
        }

        // 🔐 Get logged-in user
        AppUser user = currentUserService.getCurrentUser(auth);

        Material m = new Material();
        m.setTitle(req.getTitle().trim());
        m.setMaterialType(req.getMaterialType().name());
        m.setContentText(req.getContentText());
        m.setFileUrl(req.getFileUrl());

        // 🔐 Attach user
        m.setUser(user);

        return materialRepository.save(m);
    }
}