package com.blueforce.leaderboard.kafka;

import com.blueforce.leaderboard.model.LeaderboardEntry;
import com.blueforce.leaderboard.repository.LeaderboardEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class LeaderboardConsumers {

    @Autowired
    private LeaderboardEntryRepository repository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topic.leaderboard_updated}")
    private String leaderboardUpdatedTopic;

    // Waste updates event: { userId, userName, role, quantityKg, xpEarned }
    @KafkaListener(topics = "${app.kafka.topic.waste_updates}", groupId = "${spring.kafka.consumer.group-id}")
    public void onWasteUpdated(Map<String, Object> payload) {
        Long userId = ((Number) payload.getOrDefault("userId", 0)).longValue();
        String userName = String.valueOf(payload.getOrDefault("userName", ""));
        String role = String.valueOf(payload.getOrDefault("role", "PARTICIPANT")).toUpperCase();
        double qty = Double.parseDouble(String.valueOf(payload.getOrDefault("quantityKg", 0)));
        int xpEarned = Integer.parseInt(String.valueOf(payload.getOrDefault("xpEarned", 0)));

        LeaderboardEntry entry = repository.findAll().stream()
                .filter(e -> e.getUserId().equals(userId))
                .findFirst()
                .orElseGet(() -> LeaderboardEntry.builder()
                        .userId(userId)
                        .userName(userName)
                        .userRole(role)
                        .eventsJoined(0)
                        .totalWasteCollectedKg(0.0)
                        .xp(0)
                        .build());
        entry.setUserName(userName);
        entry.setUserRole(role);
        entry.setTotalWasteCollectedKg((entry.getTotalWasteCollectedKg() == null ? 0.0 : entry.getTotalWasteCollectedKg()) + qty);
        entry.setXp((entry.getXp() == null ? 0 : entry.getXp()) + xpEarned);
        repository.save(entry);

        kafkaTemplate.send(leaderboardUpdatedTopic, Map.of("userId", userId));
    }

    // Enrollment event: { userId, userName, role }
    @KafkaListener(topics = "${app.kafka.topic.participant_enrolled}", groupId = "${spring.kafka.consumer.group-id}")
    public void onParticipantEnrolled(Map<String, Object> payload) {
        Long userId = ((Number) payload.getOrDefault("userId", 0)).longValue();
        String userName = String.valueOf(payload.getOrDefault("userName", ""));
        String role = String.valueOf(payload.getOrDefault("role", "PARTICIPANT")).toUpperCase();

        LeaderboardEntry entry = repository.findAll().stream()
                .filter(e -> e.getUserId().equals(userId))
                .findFirst()
                .orElseGet(() -> LeaderboardEntry.builder()
                        .userId(userId)
                        .userName(userName)
                        .userRole(role)
                        .eventsJoined(0)
                        .totalWasteCollectedKg(0.0)
                        .xp(0)
                        .build());
        entry.setUserName(userName);
        entry.setUserRole(role);
        entry.setEventsJoined((entry.getEventsJoined() == null ? 0 : entry.getEventsJoined()) + 1);
        repository.save(entry);

        kafkaTemplate.send(leaderboardUpdatedTopic, Map.of("userId", userId));
    }
}
