package com.blueforce.user.dto.profile;

import lombok.Data;
import jakarta.validation.constraints.Size;

@Data
public class UpdateParticipantProfileDto {
    private String fullName;
    private String phone;
    private String address;
    @Size(max = 255)
    private String avatar;
    @Size(max = 2048)
    private String bio;
    // No id, email, role, points — those are not updatable
}
