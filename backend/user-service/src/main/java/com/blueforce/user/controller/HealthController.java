package com.blueforce.user.controller;

import com.blueforce.user.dto.UserRegisteredEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Autowired
    private ConsumerFactory<String, UserRegisteredEvent> consumerFactory;

    @GetMapping("/kafka")
    public Map<String, Object> checkKafkaHealth() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Try to get metadata to check if Kafka is reachable
            consumerFactory.getConfigurationProperties();
            response.put("status", "UP");
            response.put("message", "Kafka connection is healthy");
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("message", "Kafka connection failed: " + e.getMessage());
        }
        return response;
    }
}
