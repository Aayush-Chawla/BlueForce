package com.blueforce.event.controller;

import com.blueforce.event.config.JwtTokenExtractor;
import com.blueforce.event.dto.EnrollRequest;
import com.blueforce.event.dto.EventParticipantResponse;
import com.blueforce.event.service.EventParticipantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
public class EventParticipantController {
    
    private final EventParticipantService eventParticipantService;
    private final JwtTokenExtractor jwtTokenExtractor;
    
    @PostMapping("/{eventId}/enroll")
    public ResponseEntity<?> enrollInEvent(@PathVariable Long eventId,
                                          @Valid @RequestBody EnrollRequest request,
                                          Authentication authentication) {
        log.info("=== ENROLLMENT REQUEST DEBUG ===");
        log.info("Event ID: {}", eventId);
        log.info("Request userId: {}", request.getUserId());
        log.info("Request message: {}", request.getMessage());
        log.info("Authentication: {}", authentication);
        log.info("Authentication name: {}", authentication != null ? authentication.getName() : "null");
        log.info("Authentication authorities: {}", authentication != null ? authentication.getAuthorities() : "null");
        
        // Extract user ID from JWT token and set it in the request
        Long userId = jwtTokenExtractor.extractUserId(authentication);
        log.info("Extracted userId from JWT: {}", userId);
        request.setUserId(userId);
        log.info("Final request userId: {}", request.getUserId());
        
        try {
            EventParticipantResponse enrollment = eventParticipantService.enrollInEvent(eventId, request);
            log.info("Enrollment successful: {}", enrollment);
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
        } catch (RuntimeException e) {
            log.error("Enrollment failed: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("eventId", eventId);
            errorResponse.put("userId", request.getUserId());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/{eventId}/enroll")
    public ResponseEntity<?> cancelEnrollment(@PathVariable Long eventId, Authentication authentication) {
        try {
            Long userId = jwtTokenExtractor.extractUserId(authentication);
            eventParticipantService.cancelEnrollment(eventId, userId);
            return ResponseEntity.ok(java.util.Map.of("success", true, "message", "Enrollment cancelled"));
        } catch (Exception ex) {
            return ResponseEntity.status(400).body(java.util.Map.of("success", false, "message", ex.getMessage()));
        }
    }
    
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<?> getParticipants(@PathVariable Long eventId) {
        try {
            var roster = eventParticipantService.getParticipantRoster(eventId);
            return ResponseEntity.ok(java.util.Map.of("success", true, "participants", roster));
        } catch (Exception ex) {
            return ResponseEntity.status(400).body(java.util.Map.of("success", false, "message", ex.getMessage()));
        }
    }

    @PatchMapping("/{eventId}/participants/{participantId}")
    public ResponseEntity<?> updateParticipantStatus(@PathVariable Long eventId, @PathVariable Long participantId, @RequestBody java.util.Map<String, String> body) {
        try {
            String status = body.get("status");
            String reason = body.getOrDefault("reason", "");
            eventParticipantService.updateParticipantStatus(eventId, participantId, status, reason);
            return ResponseEntity.ok(java.util.Map.of("success", true));
        } catch (Exception ex) {
            return ResponseEntity.status(400).body(java.util.Map.of("success", false, "message", ex.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventParticipantResponse>> getUserEvents(@PathVariable Long userId) {
        log.info("Fetching events for user: {}", userId);
        
        List<EventParticipantResponse> events = eventParticipantService.getUserEvents(userId);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<EventParticipantResponse>> getUserUpcomingEvents(@PathVariable Long userId) {
        log.info("Fetching upcoming events for user: {}", userId);
        
        List<EventParticipantResponse> events = eventParticipantService.getUserUpcomingEvents(userId);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/user/{userId}/past")
    public ResponseEntity<List<EventParticipantResponse>> getUserPastEvents(@PathVariable Long userId) {
        log.info("Fetching past events for user: {}", userId);
        
        List<EventParticipantResponse> events = eventParticipantService.getUserPastEvents(userId);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{eventId}/participants/count")
    public ResponseEntity<Long> getParticipantCount(@PathVariable Long eventId) {
        log.info("Fetching participant count for event: {}", eventId);
        
        long count = eventParticipantService.getParticipantCount(eventId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/{eventId}/enrolled/{userId}")
    public ResponseEntity<Boolean> isUserEnrolled(@PathVariable Long eventId, @PathVariable Long userId) {
        log.info("Checking if user {} is enrolled in event {}", userId, eventId);
        
        boolean enrolled = eventParticipantService.isUserEnrolled(eventId, userId);
        return ResponseEntity.ok(enrolled);
    }
    
    @GetMapping("/{eventId}/test")
    public ResponseEntity<String> testEvent(@PathVariable Long eventId) {
        log.info("Testing event existence for ID: {}", eventId);
        try {
            // This will throw an exception if event doesn't exist
            eventParticipantService.getEventById(eventId);
            return ResponseEntity.ok("Event exists");
        } catch (RuntimeException e) {
            log.error("Event test failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Event not found: " + e.getMessage());
        }
    }
    
}
