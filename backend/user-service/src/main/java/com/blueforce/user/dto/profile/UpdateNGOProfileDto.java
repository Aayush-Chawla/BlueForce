package com.blueforce.user.dto.profile;

import lombok.Data;
import jakarta.validation.constraints.Size;

@Data
public class UpdateNGOProfileDto {
    private String organizationName;
    private String contactPerson;
    private String phone;
    private String address;
    @Size(max = 255)
    private String avatar;
    @Size(max = 2048)
    private String bio;
}
