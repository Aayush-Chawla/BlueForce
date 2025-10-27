package com.blueforce.event.controller;

import com.blueforce.event.config.JwtTokenExtractor;
import com.blueforce.event.dto.CreateEventRequest;
import com.blueforce.event.dto.EventResponse;
import com.blueforce.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
public class EventController {
    
    private final EventService eventService;
    private final JwtTokenExtractor jwtTokenExtractor;
    
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody CreateEventRequest request,
                                                   Authentication authentication) {
        log.info("Creating event: {} by user: {}", request.getTitle(), authentication.getName());
        
        // Extract user ID from JWT token
        Long ngoId = jwtTokenExtractor.extractUserId(authentication);
        String userRole = jwtTokenExtractor.extractUserRole(authentication);
        
        log.info("Extracted NGO ID: {}, User Role: {}", ngoId, userRole);
        
        EventResponse event = eventService.createEvent(request, ngoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }
    
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        log.info("Fetching events with filters - location: {}, startDate: {}, endDate: {}", 
                location, startDate, endDate);
        
        List<EventResponse> events;
        
        if (location != null && !location.trim().isEmpty()) {
            events = eventService.getEventsByLocation(location);
        } else if (startDate != null && endDate != null) {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            events = eventService.getEventsByDateRange(start, end);
        } else {
            events = eventService.getAllActiveEvents();
        }
        
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        log.info("Fetching event by ID: {}", id);
        
        return eventService.getEventById(id)
                .map(event -> ResponseEntity.ok(event))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/ngo/{ngoId}")
    public ResponseEntity<List<EventResponse>> getEventsByNgo(@PathVariable Long ngoId) {
        log.info("Fetching events for NGO: {}", ngoId);
        
        List<EventResponse> events = eventService.getEventsByNgo(ngoId);
        return ResponseEntity.ok(events);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long id,
                                                   @Valid @RequestBody CreateEventRequest request,
                                                   Authentication authentication) {
        log.info("Updating event: {} by user: {}", id, authentication.getName());
        
        Long ngoId = jwtTokenExtractor.extractUserId(authentication);
        
        try {
            EventResponse event = eventService.updateEvent(id, request, ngoId);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelEvent(@PathVariable Long id, Authentication authentication) {
        log.info("Cancelling event: {} by user: {}", id, authentication.getName());
        
        Long ngoId = jwtTokenExtractor.extractUserId(authentication);
        
        try {
            eventService.cancelEvent(id, ngoId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    
    @GetMapping("/ngo/{ngoId}/count")
    public ResponseEntity<Long> getEventCountByNgo(@PathVariable Long ngoId) {
        log.info("Fetching event count for NGO: {}", ngoId);
        
        long count = eventService.getEventCountByNgo(ngoId);
        return ResponseEntity.ok(count);
    }
    
}
