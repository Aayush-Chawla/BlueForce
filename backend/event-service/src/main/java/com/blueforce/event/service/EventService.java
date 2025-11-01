package com.blueforce.event.service;

import com.blueforce.event.dto.CreateEventRequest;
import com.blueforce.event.dto.EventResponse;
import com.blueforce.event.entity.Event;
import com.blueforce.event.repository.EventRepository;
import com.blueforce.event.repository.EventParticipantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.time.format.DateTimeParseException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EventService {
    
    private final EventRepository eventRepository;
    private final EventParticipantRepository eventParticipantRepository;
    
    public EventResponse createEvent(CreateEventRequest request, Long ngoId) {
        log.info("Creating event: {} for NGO: {}", request.getTitle(), ngoId);
        
        Event event = new Event();
        event.setNgoId(ngoId);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setDateTime(request.getDateTime());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setContactEmail(request.getContactEmail());
        event.setContactPhone(request.getContactPhone());
        event.setStatus(Event.EventStatus.ACTIVE);
        event.setCurrentParticipants(0);
        event.setImageUrl(request.getImageUrl());
        event.setWasteCollected(request.getWasteCollected());
        
        Event savedEvent = eventRepository.save(event);
        log.info("Event created successfully with ID: {}", savedEvent.getId());
        
        return EventResponse.fromEntity(savedEvent);
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> getAllUpcomingEvents() {
        log.info("Fetching all upcoming events");
        List<Event> events = eventRepository.findUpcomingEvents(LocalDateTime.now());
        return events.stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Optional<EventResponse> getEventById(Long eventId) {
        log.info("Fetching event by ID: {}", eventId);
        return eventRepository.findById(eventId)
                .map(EventResponse::fromEntity);
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByNgo(Long ngoId) {
        log.info("Fetching events for NGO: {}", ngoId);
        List<Event> events = eventRepository.findByNgoIdAndStatusOrderByDateTimeDesc(ngoId, Event.EventStatus.ACTIVE);
        return events.stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByLocation(String location) {
        log.info("Fetching events by location: {}", location);
        List<Event> events = eventRepository.findByLocationContainingIgnoreCaseAndStatusOrderByDateTimeDesc(location, Event.EventStatus.ACTIVE);
        return events.stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Fetching events by date range: {} to {}", startDate, endDate);
        List<Event> events = eventRepository.findEventsByDateRange(startDate, endDate);
        return events.stream()
                .map(EventResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    public EventResponse updateEvent(Long eventId, CreateEventRequest request, Long ngoId) {
        log.info("Updating event: {} for NGO: {}", eventId, ngoId);
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
        
        // Check if the NGO owns this event
        if (!event.getNgoId().equals(ngoId)) {
            throw new RuntimeException("Unauthorized: You can only update your own events");
        }
        
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setDateTime(request.getDateTime());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setContactEmail(request.getContactEmail());
        event.setContactPhone(request.getContactPhone());
        event.setImageUrl(request.getImageUrl());
        event.setWasteCollected(request.getWasteCollected());
        
        Event updatedEvent = eventRepository.save(event);
        log.info("Event updated successfully: {}", updatedEvent.getId());
        
        return EventResponse.fromEntity(updatedEvent);
    }
    
    public void cancelEvent(Long eventId, Long ngoId) {
        log.info("Cancelling event: {} for NGO: {}", eventId, ngoId);
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
        
        // Check if the NGO owns this event
        if (!event.getNgoId().equals(ngoId)) {
            throw new RuntimeException("Unauthorized: You can only cancel your own events");
        }
        
        event.setStatus(Event.EventStatus.CANCELLED);
        eventRepository.save(event);
        log.info("Event cancelled successfully: {}", eventId);
    }
    
    @Transactional(readOnly = true)
    public long getEventCountByNgo(Long ngoId) {
        return eventRepository.countByNgoIdAndStatus(ngoId, Event.EventStatus.ACTIVE);
    }

    public Page<EventResponse> advancedList(String status, String location, String startDate, String endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Event> filtered = eventRepository.findAll();
        if (status != null && !status.isBlank()) {
            String stat = status.trim().toUpperCase();
            filtered = filtered.stream()
                .filter(e -> e.getStatus().name().equals(stat))
                .toList();
        }
        if (location != null && !location.isBlank()) {
            filtered = filtered.stream()
                .filter(e -> e.getLocation().toLowerCase().contains(location.toLowerCase()))
                .toList();
        }
        if (startDate != null) {
            try {
                var date = java.time.LocalDate.parse(startDate);
                filtered = filtered.stream()
                    .filter(e -> !e.getDateTime().toLocalDate().isBefore(date))
                    .toList();
            } catch(DateTimeParseException ignored){}
        }
        if (endDate != null) {
            try {
                var date = java.time.LocalDate.parse(endDate);
                filtered = filtered.stream()
                    .filter(e -> !e.getDateTime().toLocalDate().isAfter(date))
                    .toList();
            } catch(DateTimeParseException ignored){}
        }
        int start = Math.min(page*size, filtered.size());
        int end = Math.min((page+1)*size, filtered.size());
        List<EventResponse> pageList = filtered.subList(start, end).stream().map(EventResponse::fromEntity).toList();
        return new PageImpl<>(pageList, pageable, filtered.size());
    }

    public java.util.Map<String, Object> getStatsOverview() {
        long totalEvents = eventRepository.count();
        long totalParticipants = eventParticipantRepository.count();
        int totalWaste = eventRepository.findAll().stream().mapToInt(e -> e.getWasteCollected() != null ? e.getWasteCollected() : 0).sum();
        return java.util.Map.of(
            "totalEvents", totalEvents,
            "totalParticipants", totalParticipants,
            "totalWasteCollected", totalWaste
        );
    }
}
