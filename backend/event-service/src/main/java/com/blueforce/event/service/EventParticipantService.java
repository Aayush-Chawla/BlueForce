package com.blueforce.event.service;

import com.blueforce.event.dto.EnrollRequest;
import com.blueforce.event.dto.EventEnrollmentEvent;
import com.blueforce.event.dto.EventParticipantResponse;
import com.blueforce.event.entity.Event;
import com.blueforce.event.entity.EventParticipant;
import com.blueforce.event.repository.EventParticipantRepository;
import com.blueforce.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EventParticipantService {
    
    private final EventParticipantRepository eventParticipantRepository;
    private final EventRepository eventRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public EventParticipantResponse enrollInEvent(Long eventId, EnrollRequest request) {
        log.info("=== ENROLLMENT SERVICE DEBUG ===");
        log.info("User {} enrolling in event {}", request.getUserId(), eventId);
        log.info("Request details: userId={}, message={}", request.getUserId(), request.getMessage());
        
        // Check if event exists and is active
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
        
        log.info("Event found: id={}, title={}, status={}, maxParticipants={}, currentParticipants={}", 
                event.getId(), event.getTitle(), event.getStatus(), event.getMaxParticipants(), event.getCurrentParticipants());
        
        if (event.getStatus() != Event.EventStatus.ACTIVE) {
            log.error("Event is not active. Status: {}", event.getStatus());
            throw new RuntimeException("Cannot enroll in inactive event");
        }
        
        if (event.getDateTime().isBefore(LocalDateTime.now())) {
            log.error("Event is in the past. DateTime: {}", event.getDateTime());
            throw new RuntimeException("Cannot enroll in past event");
        }
        
        // Check if user is already enrolled
        Optional<EventParticipant> existingEnrollment = eventParticipantRepository
                .findByEventIdAndUserId(eventId, request.getUserId());
        
        log.info("Existing enrollment check: {}", existingEnrollment.isPresent());
        
        if (existingEnrollment.isPresent()) {
            EventParticipant participant = existingEnrollment.get();
            log.info("Existing participant status: {}", participant.getStatus());
            if (participant.getStatus() == EventParticipant.ParticipationStatus.ENROLLED) {
                throw new RuntimeException("User is already enrolled in this event");
            } else if (participant.getStatus() == EventParticipant.ParticipationStatus.CANCELLED) {
                // Re-enroll the user
                participant.setStatus(EventParticipant.ParticipationStatus.ENROLLED);
                participant.setEnrolledAt(LocalDateTime.now());
                EventParticipant savedParticipant = eventParticipantRepository.save(participant);
                
                // Update event participant count
                updateEventParticipantCount(eventId);
                
                // Send Kafka event
                sendEnrollmentEvent(event, request.getUserId());
                
                log.info("User re-enrolled in event: {}", eventId);
                return EventParticipantResponse.fromEntity(savedParticipant);
            }
        }
        
        // Check if event is full
        if (event.getMaxParticipants() != null && 
            event.getCurrentParticipants() >= event.getMaxParticipants()) {
            log.error("Event is full. Current: {}, Max: {}", event.getCurrentParticipants(), event.getMaxParticipants());
            throw new RuntimeException("Event is full");
        }
        
        // Create new enrollment
        EventParticipant participant = new EventParticipant();
        participant.setEventId(eventId);
        participant.setUserId(request.getUserId());
        participant.setStatus(EventParticipant.ParticipationStatus.ENROLLED);
        participant.setEnrolledAt(LocalDateTime.now());
        
        log.info("Creating new enrollment: eventId={}, userId={}", eventId, request.getUserId());
        
        EventParticipant savedParticipant = eventParticipantRepository.save(participant);
        
        // Update event participant count
        updateEventParticipantCount(eventId);
        
        // Send Kafka event
        sendEnrollmentEvent(event, request.getUserId());
        
        log.info("User enrolled successfully in event: {}", eventId);
        return EventParticipantResponse.fromEntity(savedParticipant);
    }
    
    public void cancelEnrollment(Long eventId, Long userId) {
        log.info("User {} cancelling enrollment in event {}", userId, eventId);
        
        EventParticipant participant = eventParticipantRepository
                .findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        if (participant.getStatus() != EventParticipant.ParticipationStatus.ENROLLED) {
            throw new RuntimeException("User is not currently enrolled in this event");
        }
        
        participant.setStatus(EventParticipant.ParticipationStatus.CANCELLED);
        eventParticipantRepository.save(participant);
        
        // Update event participant count
        updateEventParticipantCount(eventId);
        
        log.info("Enrollment cancelled successfully for event: {}", eventId);
    }
    
    @Transactional(readOnly = true)
    public List<EventParticipantResponse> getEventParticipants(Long eventId) {
        log.info("Fetching participants for event: {}", eventId);
        List<EventParticipant> participants = eventParticipantRepository
                .findByEventIdOrderByEnrolledAtDesc(eventId);
        return participants.stream()
                .map(EventParticipantResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventParticipantResponse> getUserEvents(Long userId) {
        log.info("Fetching events for user: {}", userId);
        List<EventParticipant> participants = eventParticipantRepository
                .findByUserIdOrderByEnrolledAtDesc(userId);
        return participants.stream()
                .map(EventParticipantResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventParticipantResponse> getUserUpcomingEvents(Long userId) {
        log.info("Fetching upcoming events for user: {}", userId);
        List<EventParticipant> participants = eventParticipantRepository
                .findUpcomingEventsByUser(userId, LocalDateTime.now());
        return participants.stream()
                .map(EventParticipantResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventParticipantResponse> getUserPastEvents(Long userId) {
        log.info("Fetching past events for user: {}", userId);
        List<EventParticipant> participants = eventParticipantRepository
                .findPastEventsByUser(userId, LocalDateTime.now());
        return participants.stream()
                .map(EventParticipantResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public long getParticipantCount(Long eventId) {
        return eventParticipantRepository.countByEventIdAndStatus(eventId, EventParticipant.ParticipationStatus.ENROLLED);
    }
    
    @Transactional(readOnly = true)
    public boolean isUserEnrolled(Long eventId, Long userId) {
        return eventParticipantRepository.findByEventIdAndUserId(eventId, userId)
                .map(participant -> participant.getStatus() == EventParticipant.ParticipationStatus.ENROLLED)
                .orElse(false);
    }

    public java.util.List<java.util.Map<String, Object>> getParticipantRoster(Long eventId) {
        var parts = eventParticipantRepository.findByEventIdOrderByEnrolledAtDesc(eventId);
        return parts.stream().map(ep -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("userId", ep.getUserId());
            map.put("name", "Participant " + ep.getUserId()); // TODO: real name via UserService
            map.put("avatar", "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400");
            map.put("status", ep.getStatus().name());
            return map;
        }).toList();
    }

    public void updateParticipantStatus(Long eventId, Long participantId, String status, String reason) {
        var ep = eventParticipantRepository.findById(participantId)
            .orElseThrow(() -> new IllegalArgumentException("Not found"));
        if (!ep.getEventId().equals(eventId)) throw new IllegalStateException("Event mismatch");
        var allowed = java.util.Set.of("APPROVED", "REJECTED", "COMPLETED", "CANCELLED");
        if (!allowed.contains(status)) throw new IllegalArgumentException("Invalid status");
        ep.setStatus(EventParticipant.ParticipationStatus.valueOf(status));
        ep.setStatusReason(reason);
        eventParticipantRepository.save(ep);
    }
    
    private void updateEventParticipantCount(Long eventId) {
        long enrolledCount = eventParticipantRepository.countByEventIdAndStatus(eventId, EventParticipant.ParticipationStatus.ENROLLED);
        eventRepository.findById(eventId).ifPresent(event -> {
            event.setCurrentParticipants((int) enrolledCount);
            eventRepository.save(event);
        });
    }
    
    private void sendEnrollmentEvent(Event event, Long userId) {
        try {
            EventEnrollmentEvent enrollmentEvent = EventEnrollmentEvent.createEnrollmentEvent(
                    event.getId(), userId, event.getTitle(), event.getLocation(), event.getDateTime());
            kafkaTemplate.send("event-enrollments", enrollmentEvent);
            log.info("Enrollment event sent to Kafka for user: {} in event: {}", userId, event.getId());
        } catch (Exception e) {
            log.error("Failed to send enrollment event to Kafka", e);
        }
    }
    
    @Transactional(readOnly = true)
    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
    }
}
