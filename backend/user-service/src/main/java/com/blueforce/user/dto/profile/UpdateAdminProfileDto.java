package com.blueforce.user.dto.profile;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class UpdateAdminProfileDto {
    @NotBlank
    private String fullName;
    private String phone;
    @Size(max = 255)
    private String avatar;
    @Size(max = 2048)
    private String bio;
}
