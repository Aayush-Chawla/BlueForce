package com.blueforce.event.dto;

import com.blueforce.event.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    
    private Long id;
    private Long ngoId;
    private String title;
    private String description;
    private String location;
    private LocalDateTime dateTime;
    private LocalDateTime createdAt;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private Event.EventStatus status;
    private String contactEmail;
    private String contactPhone;
    private String imageUrl;
    private Integer wasteCollected;
    
    // Additional computed fields
    private boolean isFull;
    private boolean isUpcoming;
    private long participantCount;
    
    public static EventResponse fromEntity(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setNgoId(event.getNgoId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setLocation(event.getLocation());
        response.setDateTime(event.getDateTime());
        response.setCreatedAt(event.getCreatedAt());
        response.setMaxParticipants(event.getMaxParticipants());
        response.setCurrentParticipants(event.getCurrentParticipants());
        response.setStatus(event.getStatus());
        response.setContactEmail(event.getContactEmail());
        response.setContactPhone(event.getContactPhone());
        response.setImageUrl(event.getImageUrl());
        response.setWasteCollected(event.getWasteCollected());
        
        // Compute additional fields
        response.setFull(event.getMaxParticipants() != null && 
                       event.getCurrentParticipants() >= event.getMaxParticipants());
        response.setUpcoming(event.getDateTime().isAfter(LocalDateTime.now()));
        
        return response;
    }
}
