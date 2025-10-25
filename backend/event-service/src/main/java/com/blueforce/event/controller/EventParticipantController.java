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

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
public class EventParticipantController {
    
    private final EventParticipantService eventParticipantService;
    private final JwtTokenExtractor jwtTokenExtractor;
    
    @PostMapping("/{eventId}/enroll")
    public ResponseEntity<EventParticipantResponse> enrollInEvent(@PathVariable Long eventId,
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
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{eventId}/enroll")
    public ResponseEntity<Void> cancelEnrollment(@PathVariable Long eventId, Authentication authentication) {
        log.info("User {} cancelling enrollment in event {}", authentication.getName(), eventId);
        
        Long userId = jwtTokenExtractor.extractUserId(authentication);
        
        try {
            eventParticipantService.cancelEnrollment(eventId, userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<EventParticipantResponse>> getEventParticipants(@PathVariable Long eventId) {
        log.info("Fetching participants for event: {}", eventId);
        
        List<EventParticipantResponse> participants = eventParticipantService.getEventParticipants(eventId);
        return ResponseEntity.ok(participants);
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
