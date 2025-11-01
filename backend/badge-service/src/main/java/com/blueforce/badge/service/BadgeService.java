package com.blueforce.badge.service;

import com.blueforce.badge.model.Badge;
import com.blueforce.badge.model.UserBadge;
import com.blueforce.badge.repository.BadgeRepository;
import com.blueforce.badge.repository.UserBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topic.badge_awarded}")
    private String awardedTopic;

    public List<UserBadge> getUserBadges(Long userId) {
        return userBadgeRepository.findByUserId(userId);
    }

    public List<UserBadge> evaluateAndAward(Long userId) {
        List<UserBadge> awarded = new ArrayList<>();
        List<Badge> all = badgeRepository.findAll();
        // Basic example rule: award badges with thresholdXp <= 150 for demo
        for (Badge badge : all) {
            if (badge.getThresholdXp() != null && badge.getThresholdXp() <= 150) {
                UserBadge ub = UserBadge.builder()
                        .userId(userId)
                        .badge(badge)
                        .awardedAt(LocalDateTime.now())
                        .build();
                userBadgeRepository.save(ub);
                awarded.add(ub);
                kafkaTemplate.send(awardedTopic, java.util.Map.of("userId", userId, "badgeKey", badge.getKey()));
            }
        }
        return awarded;
    }
}
