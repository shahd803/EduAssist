package com.eduassist.eduassist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MaterialRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotNull
    private MaterialType materialType;

    private String contentText;
    private String fileUrl;

    public enum MaterialType { TEXT, PDF, LINK }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public MaterialType getMaterialType() { return materialType; }
    public void setMaterialType(MaterialType materialType) { this.materialType = materialType; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
}

