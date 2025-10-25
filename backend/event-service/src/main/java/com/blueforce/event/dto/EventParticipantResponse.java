package com.blueforce.event.dto;

import com.blueforce.event.entity.EventParticipant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventParticipantResponse {
    
    private Long id;
    private Long eventId;
    private Long userId;
    private LocalDateTime enrolledAt;
    private EventParticipant.ParticipationStatus status;
    private Boolean attended;
    private String feedback;
    private Integer rating;
    
    // Additional fields for display
    private String userName; // Will be populated from user service
    private String userEmail; // Will be populated from user service
    
    public static EventParticipantResponse fromEntity(EventParticipant participant) {
        EventParticipantResponse response = new EventParticipantResponse();
        response.setId(participant.getId());
        response.setEventId(participant.getEventId());
        response.setUserId(participant.getUserId());
        response.setEnrolledAt(participant.getEnrolledAt());
        response.setStatus(participant.getStatus());
        response.setAttended(participant.getAttended());
        response.setFeedback(participant.getFeedback());
        response.setRating(participant.getRating());
        return response;
    }
}
