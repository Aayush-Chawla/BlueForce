package com.blueforce.auth.service;

import com.blueforce.auth.dto.*;
import com.blueforce.auth.entity.*;
import com.blueforce.auth.repository.AuthUserRepository;
import com.blueforce.auth.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.CompletableFuture;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private KafkaTemplate<String, UserRegisteredEvent> kafkaTemplate;

    // ✅ Register
    public AuthResponse register(RegisterRequest request) {

        if (authUserRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        String normalizedRole = normalizeRole(request.getRole());

        AuthUser authUser = AuthUser.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(normalizedRole)
                .provider(AuthProviderType.LOCAL)
                .verified(false)
                .build();

        AuthUser saved = authUserRepository.save(authUser);

        // Publish event to Kafka
        publishUserRegisteredEvent(saved);

        return new AuthResponse(saved.getId(), saved.getEmail(), saved.getRole(), saved.isVerified());
    }

    // ✅ Login
    public LoginResponse login(LoginRequest request) {
        AuthUser user = authUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        boolean passwordMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!passwordMatch) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String normalizedRole = normalizeRole(user.getRole());
        if (!normalizedRole.equals(user.getRole())) {
            user.setRole(normalizedRole);
            authUserRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail(), normalizedRole);
        return LoginResponse.builder()
            .message("Login successful")
            .token(token)
            .userId(user.getId())
            .email(user.getEmail())
            .role(normalizedRole)
            .verified(user.isVerified())
            .build();
    }

    private void publishUserRegisteredEvent(AuthUser authUser) {
        try {
            UserRegisteredEvent event = UserRegisteredEvent.builder()
                    .id(authUser.getId())
                    .email(authUser.getEmail())
                    .role(authUser.getRole())
                    .verified(authUser.isVerified())
                    .provider(authUser.getProvider().name())
                    .build();

            CompletableFuture<SendResult<String, UserRegisteredEvent>> future = kafkaTemplate.send("user-registered", event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Successfully sent user registration event for user: {} with offset: {}", 
                            authUser.getEmail(), result.getRecordMetadata().offset());
                } else {
                    logger.error("Failed to send user registration event for user: {}", authUser.getEmail(), ex);
                }
            });
        } catch (Exception e) {
            logger.error("Error publishing user registration event for user: {}", authUser.getEmail(), e);
        }
    }

    private String normalizeRole(String role) {
        if (role == null) return "participant";
        String r = role.trim().toLowerCase();
        return switch (r) {
            case "admin" -> "admin";
            case "ngo", "organizer" -> "ngo";
            case "participant", "volunteer" -> "participant";
            default -> "participant";
        };
    }
}
