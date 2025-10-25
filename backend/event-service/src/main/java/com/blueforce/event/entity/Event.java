package com.blueforce.event.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "ngo_id", nullable = false)
    private Long ngoId;
    
    @Column(name = "title", nullable = false, length = 255)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "location", nullable = false, length = 255)
    private String location;
    
    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Additional fields for better event management
    @Column(name = "max_participants")
    private Integer maxParticipants;
    
    @Column(name = "current_participants", nullable = false)
    private Integer currentParticipants = 0;
    
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.ACTIVE;
    
    @Column(name = "contact_email")
    private String contactEmail;
    
    @Column(name = "contact_phone")
    private String contactPhone;
    
    public enum EventStatus {
        ACTIVE, CANCELLED, COMPLETED
    }
}
