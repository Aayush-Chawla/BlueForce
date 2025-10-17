package com.blueforce.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String role; // ADMIN, NGO, PARTICIPANT

    // 🔹 Common fields
    private String name;
    private String phone;
    private String address;
    private boolean active = true;

    @Column(updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    private java.time.LocalDateTime lastLogin;

    // 🔹 NGO-specific fields
    private String organizationName;
    private String contactPerson;

    // 🔹 Participant-specific fields
    private int points = 0;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = java.time.LocalDateTime.now();
        }
        // ensure default active
        this.active = (this.active);
    }

    @PreUpdate
    public void onUpdate() {
        // reserved for future timestamp updates
    }
}
