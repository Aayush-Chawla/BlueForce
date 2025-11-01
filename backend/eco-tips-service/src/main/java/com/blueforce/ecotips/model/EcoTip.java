package com.blueforce.ecotips.model;

import jakarta.validation.constraints.NotBlank;

public class EcoTip {
    private String id;
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    @NotBlank
    private String category; // e.g., waste-reduction, ocean-protection
    private String difficulty; // easy, medium, hard
    private String impact; // low, medium, high

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getImpact() { return impact; }
    public void setImpact(String impact) { this.impact = impact; }
}




