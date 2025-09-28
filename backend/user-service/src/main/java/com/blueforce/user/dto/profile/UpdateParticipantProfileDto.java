package com.blueforce.user.dto.profile;

import lombok.Data;

@Data
public class UpdateParticipantProfileDto {
    private String fullName;
    private String phone;
    private String address;
    // No id, email, role, points — those are not updatable
}
