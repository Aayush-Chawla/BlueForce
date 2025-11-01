package com.blueforce.ngo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ngos", indexes = {
        @Index(name = "idx_ngos_owner", columnList = "owner_user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ngo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "owner_user_id", nullable = false)
    private Long ownerUserId;

    @Column(nullable = false)
    private boolean verified;

    private String location;
    private String contactEmail;
    private String contactPhone;
}

