package com.blueforce.event.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventEnrollmentEvent {
    
    private Long eventId;
    private Long userId;
    private String eventTitle;
    private String eventLocation;
    private LocalDateTime eventDateTime;
    private LocalDateTime enrolledAt;
    private String action; // ENROLLED, CANCELLED, COMPLETED
    
    public static EventEnrollmentEvent createEnrollmentEvent(Long eventId, Long userId, String eventTitle, 
                                                           String eventLocation, LocalDateTime eventDateTime) {
        EventEnrollmentEvent event = new EventEnrollmentEvent();
        event.setEventId(eventId);
        event.setUserId(userId);
        event.setEventTitle(eventTitle);
        event.setEventLocation(eventLocation);
        event.setEventDateTime(eventDateTime);
        event.setEnrolledAt(LocalDateTime.now());
        event.setAction("ENROLLED");
        return event;
    }
}
