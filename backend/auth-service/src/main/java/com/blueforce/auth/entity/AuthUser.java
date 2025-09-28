package com.blueforce.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.security.AuthProvider;
import java.time.LocalDateTime;

@Entity
@Table(name = "auth_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role; // ADMIN, NGO, PARTICIPANT

    @Enumerated(EnumType.STRING)
    private AuthProviderType provider; // LOCAL, AADHAAR, GOOGLE, etc.

    private boolean verified = false;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
