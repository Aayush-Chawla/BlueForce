package com.blueforce.ngo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "ngo-service is up and running",
            "service", "ngo-service",
            "status", "healthy"
        ));
    }
}

