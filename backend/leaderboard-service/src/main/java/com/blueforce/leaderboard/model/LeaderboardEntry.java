package com.blueforce.leaderboard.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leaderboard_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String userRole; // PARTICIPANT or NGO for per-role boards

    @Column(nullable = false)
    private Integer eventsJoined;

    @Column(nullable = false)
    private Double totalWasteCollectedKg;

    @Column(nullable = false)
    private Integer xp;
}
