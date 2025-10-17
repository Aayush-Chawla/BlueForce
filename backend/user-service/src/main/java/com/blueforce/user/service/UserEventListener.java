package com.blueforce.user.service;

import com.blueforce.user.dto.UserRegisteredEvent;
import com.blueforce.user.entity.User;
import com.blueforce.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserEventListener {

    private static final Logger logger = LoggerFactory.getLogger(UserEventListener.class);

    @Autowired
    private UserRepository userRepository;

    @KafkaListener(topics = "user-registered", groupId = "user-service-group")
    @Transactional
    public void consume(UserRegisteredEvent event) {
        try {
            logger.info("Received user registration event: {}", event);

            // Try to update existing user by email
            int updated = userRepository.updateUserFields(
                    event.getEmail(),
                    event.getRole(),
                    true
            );

            if (updated == 0) {
                // No row updated → insert a new one
                User user = new User();
                user.setEmail(event.getEmail());
                user.setRole(event.getRole());
                user.setActive(true);

                userRepository.save(user);
                logger.info("Created new user with email: {}", event.getEmail());
            } else {
                logger.info("Updated existing user with email: {}", event.getEmail());
            }
        } catch (Exception e) {
            logger.error("Error processing user registration event for user: {}", event.getEmail(), e);
            // In a production environment, you might want to implement retry logic or dead letter queue
            throw e; // Re-throw to trigger Kafka retry mechanism
        }
    }
}
