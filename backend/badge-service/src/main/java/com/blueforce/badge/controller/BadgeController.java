package com.blueforce.badge.controller;

import com.blueforce.badge.model.UserBadge;
import com.blueforce.badge.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserBadges(@PathVariable Long userId) {
        List<UserBadge> badges = badgeService.getUserBadges(userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "OK", "data", Map.of("badges", badges)));
    }

    @PostMapping("/evaluate/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','NGO')")
    public ResponseEntity<?> evaluate(@PathVariable Long userId) {
        var awarded = badgeService.evaluateAndAward(userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Evaluated", "data", Map.of("awarded", awarded)));
    }
}
