package com.blueforce.user.service;

import com.blueforce.user.dto.UserRegisteredEvent;
import com.blueforce.user.entity.User;
import com.blueforce.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UserEventListener {

    private static final Logger logger = LoggerFactory.getLogger(UserEventListener.class);

    @Autowired
    private UserRepository userRepository;

    @KafkaListener(topics = "user-registered", groupId = "user-service-group")
    public void handleUserRegistration(UserRegisteredEvent event) {
        User user = userRepository.findByEmail(event.getEmail()).orElse(null);
        String mappedRole = (event.getRole() != null && event.getRole().equalsIgnoreCase("VOLUNTEER")) ? "PARTICIPANT" : event.getRole();
        if (user == null) {
            user = User.builder()
                    .email(event.getEmail())
                    .role(mappedRole)
                    .active(event.isVerified())
                    .build();
        } else {
            user.setRole(mappedRole);
            user.setActive(event.isVerified());
        }
        userRepository.save(user);
    }
}
