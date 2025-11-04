package com.blueforce.event.scheduler;

import com.blueforce.event.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled task that automatically expires events that have passed their dateTime
 * Runs every hour to check for expired events
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class EventExpirationScheduler {
    
    private final EventService eventService;
    
  
    @Scheduled(cron = "0 0 * * * ?")
    public void expireEventsAutomatically() {
        try {
            log.info("Running scheduled task to expire events...");
            int expiredCount = eventService.expireEvents();
            if (expiredCount > 0) {
                log.info("Scheduled task completed: {} events expired", expiredCount);
            } else {
                log.debug("Scheduled task completed: No expired events found");
            }
        } catch (Exception e) {
            log.error("Error occurred while expiring events in scheduled task", e);
        }
    }
}

