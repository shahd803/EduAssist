package com.eduassist.eduassist.service;

import com.eduassist.eduassist.entity.Material;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Service
public class MaterialContentService {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    public String extractText(Material material) {

        String type = material.getMaterialType();

        if ("TEXT".equalsIgnoreCase(type)) {

            String txt = material.getContentText();

            if (txt == null || txt.isBlank()) {
                throw new IllegalArgumentException("TEXT material has no contentText");
            }

            return txt.trim();
        }

        if ("PDF".equalsIgnoreCase(type)) {

            String fileUrl = material.getFileUrl();

            if (fileUrl == null || fileUrl.isBlank()) {
                throw new IllegalArgumentException("PDF material has no fileUrl");
            }

            String decoded = URLDecoder.decode(fileUrl, StandardCharsets.UTF_8);

            // 🔥 Properly remove "/uploads/" prefix
            String relativeName;

            if (decoded.startsWith("/uploads/")) {
                relativeName = decoded.substring("/uploads/".length());
            } else if (decoded.startsWith("/")) {
                relativeName = decoded.substring(1);
            } else {
                relativeName = decoded;
            }

            File pdfFile = new File(uploadDir, relativeName);

            if (!pdfFile.exists()) {
                throw new IllegalArgumentException(
                        "PDF file not found on disk: " + pdfFile.getAbsolutePath());
            }

            return extractPdfText(pdfFile);
        }

        throw new IllegalArgumentException(
                "Unsupported materialType for AI extraction: " + type);
    }

    private String extractPdfText(File pdfFile) {

        try (PDDocument doc = PDDocument.load(pdfFile)) {

            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);

            if (text == null || text.isBlank()) {
                throw new IllegalArgumentException(
                        "PDF text extraction returned empty text");
            }

            // 🔥 safety limit
            if (text.length() > 20000) {
                text = text.substring(0, 20000);
            }

            return text;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to extract PDF text: " + e.getMessage(), e);
        }
    }
}