package com.blueforce.analytics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN','NGO')")
    public ResponseEntity<?> overview() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OK",
                "data", Map.of(
                        "events", 0,
                        "participants", 0,
                        "wasteKg", 0.0
                )
        ));
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyRole('ADMIN','NGO')")
    public ResponseEntity<?> eventStats(@RequestParam("eventId") Long eventId) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "OK",
                "data", Map.of(
                        "eventId", eventId,
                        "participants", 0,
                        "wasteKg", 0.0
                )
        ));
    }
}
