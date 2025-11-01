package com.blueforce.notification.controller;

import com.blueforce.notification.model.Notification;
import com.blueforce.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationRepository repository;

    @GetMapping("")
    public ResponseEntity<?> myNotifications(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {
        log.info("Fetching notifications for user: {}", jwt.getSubject());
        
        Long userId = Long.parseLong(
            jwt.getClaimAsString("user_id") != null 
                ? jwt.getClaimAsString("user_id") 
                : jwt.getSubject()
        );
        
        int p = page != null ? page : 0;
        int l = limit != null ? limit : 25;
        
        Page<Notification> result = repository.findByUserIdOrderByCreatedAtDesc(
            userId, 
            PageRequest.of(p, l)
        );
        
        log.info("Found {} notifications for user {}", result.getTotalElements(), userId);
        
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "OK", 
            "data", Map.of(
                "items", result.getContent(), 
                "total", result.getTotalElements(), 
                "page", p, 
                "limit", l
            )
        ));
    }

    @PostMapping("")
    public ResponseEntity<?> create(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestBody Map<String, Object> body) {
        log.info("Creating notification by user: {}", jwt.getSubject());
        
        Long userId = Long.parseLong(String.valueOf(body.getOrDefault("userId", "0")));
        String type = String.valueOf(body.getOrDefault("type", "GENERAL"));
        String message = String.valueOf(body.getOrDefault("message", ""));
        
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();
        
        Notification saved = repository.save(notification);
        log.info("Notification created successfully with ID: {}", saved.getId());
        
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "Notification created successfully", 
            "data", Map.of("id", saved.getId())
        ));
    }
}

