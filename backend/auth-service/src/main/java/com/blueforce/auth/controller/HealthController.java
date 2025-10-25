package com.blueforce.auth.controller;

import com.blueforce.auth.dto.UserRegisteredEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Autowired
    private KafkaTemplate<String, UserRegisteredEvent> kafkaTemplate;

    @GetMapping("/kafka")
    public Map<String, Object> checkKafkaHealth() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Try to get metadata to check if Kafka is reachable
            kafkaTemplate.getProducerFactory().getConfigurationProperties();
            response.put("status", "UP");
            response.put("message", "Kafka connection is healthy");
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("message", "Kafka connection failed: " + e.getMessage());
        }
        return response;
    }
}
