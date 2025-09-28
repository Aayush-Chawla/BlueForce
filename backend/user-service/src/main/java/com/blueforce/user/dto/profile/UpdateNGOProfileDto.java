package com.blueforce.user.dto.profile;

import lombok.Data;

@Data
public class UpdateNGOProfileDto {
    private String organizationName;
    private String contactPerson;
    private String phone;
    private String address;
}
