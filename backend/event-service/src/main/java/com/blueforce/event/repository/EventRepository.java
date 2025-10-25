package com.blueforce.event.repository;

import com.blueforce.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find all upcoming events
    @Query("SELECT e FROM Event e WHERE e.dateTime > :currentTime AND e.status = 'ACTIVE' ORDER BY e.dateTime ASC")
    List<Event> findUpcomingEvents(@Param("currentTime") LocalDateTime currentTime);
    
    // Find events by NGO
    List<Event> findByNgoIdAndStatusOrderByDateTimeDesc(Long ngoId, Event.EventStatus status);
    
    // Find events by location
    List<Event> findByLocationContainingIgnoreCaseAndStatusOrderByDateTimeDesc(String location, Event.EventStatus status);
    
    // Find events by date range
    @Query("SELECT e FROM Event e WHERE e.dateTime BETWEEN :startDate AND :endDate AND e.status = 'ACTIVE' ORDER BY e.dateTime ASC")
    List<Event> findEventsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Count events by NGO
    long countByNgoIdAndStatus(Long ngoId, Event.EventStatus status);
}
