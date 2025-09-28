package com.blueforce.user.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NgoProfileDto {
    private Long id;
    private String email;
    private String role;
    private String organizationName;
    private String contactPerson;
    private String phone;
    private String address;
}
