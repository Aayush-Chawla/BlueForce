package com.blueforce.notification.kafka;

import com.blueforce.notification.model.Notification;
import com.blueforce.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumers {

    private final NotificationRepository repository;

    @Value("${app.kafka.topic.badge_awarded}")
    private String awardedTopic;

    @KafkaListener(topics = "${app.kafka.topic.badge_awarded}", groupId = "${spring.kafka.consumer.group-id}")
    public void onBadgeAwarded(Map<String, Object> payload) {
        log.info("Received badge awarded event: {}", payload);
        
        try {
            Long userId = ((Number) payload.getOrDefault("userId", 0)).longValue();
            String badgeKey = String.valueOf(payload.getOrDefault("badgeKey", ""));
            
            Notification notification = Notification.builder()
                    .userId(userId)
                    .type("BADGE_AWARDED")
                    .message("Congratulations! You earned badge: " + badgeKey)
                    .createdAt(LocalDateTime.now())
                    .read(false)
                    .build();
            
            Notification saved = repository.save(notification);
            log.info("Notification created for badge award: {}", saved.getId());
        } catch (Exception e) {
            log.error("Error processing badge awarded event: {}", e.getMessage(), e);
        }
    }
}

