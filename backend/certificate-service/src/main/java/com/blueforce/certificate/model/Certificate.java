package com.blueforce.certificate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates", indexes = {
        @Index(name = "idx_cert_participant", columnList = "participant_id"),
        @Index(name = "idx_cert_event", columnList = "event_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participant_id", nullable = false)
    private Long participantId;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "organizer_id", nullable = false)
    private Long organizerId; // NGO user id

    @Column(name = "template_id", nullable = false)
    private Long templateId;

    @Column(name = "certificate_type", nullable = false)
    private String certificateType;

    @Column(name = "verification_code", nullable = false, unique = true)
    private String verificationCode;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;
}




