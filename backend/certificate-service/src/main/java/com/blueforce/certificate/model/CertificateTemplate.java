package com.blueforce.certificate.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certificate_templates", indexes = {
        @Index(name = "idx_templates_owner", columnList = "owner_user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // participation, achievement, leadership

    @Column(name = "owner_user_id", nullable = false)
    private Long ownerUserId; // NGO owner
}




