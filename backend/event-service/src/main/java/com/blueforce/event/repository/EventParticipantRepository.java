package com.blueforce.event.repository;

import com.blueforce.event.entity.EventParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    
    // Find participants by event ID
    List<EventParticipant> findByEventIdOrderByEnrolledAtDesc(Long eventId);
    
    // Find events by user ID
    List<EventParticipant> findByUserIdOrderByEnrolledAtDesc(Long userId);
    
    // Check if user is already enrolled in event
    Optional<EventParticipant> findByEventIdAndUserId(Long eventId, Long userId);
    
    // Count participants by event
    long countByEventIdAndStatus(Long eventId, EventParticipant.ParticipationStatus status);
    
    // Find participants by event and status
    List<EventParticipant> findByEventIdAndStatus(Long eventId, EventParticipant.ParticipationStatus status);
    
    // Find user's upcoming events
    @Query("SELECT ep FROM EventParticipant ep JOIN Event e ON ep.eventId = e.id " +
           "WHERE ep.userId = :userId AND ep.status = 'ENROLLED' AND e.dateTime > :currentTime " +
           "ORDER BY e.dateTime ASC")
    List<EventParticipant> findUpcomingEventsByUser(@Param("userId") Long userId, @Param("currentTime") java.time.LocalDateTime currentTime);
    
    // Find user's past events
    @Query("SELECT ep FROM EventParticipant ep JOIN Event e ON ep.eventId = e.id " +
           "WHERE ep.userId = :userId AND e.dateTime < :currentTime " +
           "ORDER BY e.dateTime DESC")
    List<EventParticipant> findPastEventsByUser(@Param("userId") Long userId, @Param("currentTime") java.time.LocalDateTime currentTime);
}
