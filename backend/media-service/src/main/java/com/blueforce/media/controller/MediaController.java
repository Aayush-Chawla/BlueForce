package com.blueforce.media.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@Slf4j
public class MediaController {

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN','NGO')")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        log.info("Uploading file: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());
        
        try {
            // Generate a unique URL for the uploaded file
            // In a production environment, you would save the file to a storage service
            // (S3, Azure Blob Storage, etc.) and return the actual URL
            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            String url = "https://cdn.example.com/" + fileName;
            
            log.info("File uploaded successfully: {}", url);
            
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "File uploaded successfully", 
                "data", Map.of("url", url, "fileName", fileName)
            ));
        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to upload file: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "media-service is up and running",
            "service", "media-service",
            "status", "healthy"
        ));
    }
}

