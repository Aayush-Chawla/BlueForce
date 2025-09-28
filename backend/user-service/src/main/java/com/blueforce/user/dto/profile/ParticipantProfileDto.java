package com.blueforce.user.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantProfileDto {
    private Long id;          // read-only
    private String email;     // read-only
    private String role;      // read-only
    private String fullName;
    private String phone;
    private String address;
    private int points;       // e.g. leaderboard points (read-only, not editable)
}
