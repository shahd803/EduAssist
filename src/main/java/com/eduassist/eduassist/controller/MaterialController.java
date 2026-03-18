package com.eduassist.eduassist.controller;

import com.eduassist.eduassist.dto.MaterialRequest;
import com.eduassist.eduassist.entity.Material;
import com.eduassist.eduassist.service.MaterialService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/materials")
public class MaterialController {

    private final MaterialService materialService;
    private static final String UPLOAD_DIR = "uploads";

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    // ================= TEXT / LINK =================
    @PostMapping
    public ResponseEntity<?> createMaterial(
            @RequestBody MaterialRequest request,
            Authentication auth) {

        try {

            Material saved = materialService.createMaterial(request, auth);

            return ResponseEntity.ok(
                    Map.of(
                            "materialId", saved.getMaterialId(),
                            "title", saved.getTitle(),
                            "type", saved.getMaterialType()
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ================= PDF UPLOAD =================
    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            Authentication auth
    ) {

        try {

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "File is required"));
            }

            if (!file.getOriginalFilename()
                    .toLowerCase().endsWith(".pdf")) {

                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Only PDF files allowed"));
            }

            Files.createDirectories(Paths.get(UPLOAD_DIR));

            String filename = UUID.randomUUID() +
                    "_" + file.getOriginalFilename();

            Path path = Paths.get(UPLOAD_DIR, filename);
            Files.write(path, file.getBytes());

            MaterialRequest req = new MaterialRequest();
            req.setTitle(title);
            req.setMaterialType(MaterialRequest.MaterialType.PDF);

            req.setFileUrl("/uploads/" + filename);

            Material saved = materialService.createMaterial(req, auth);

            return ResponseEntity.ok(
                    Map.of(
                            "materialId", saved.getMaterialId(),
                            "title", saved.getTitle(),
                            "type", saved.getMaterialType(),
                            "fileUrl", saved.getFileUrl()
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}