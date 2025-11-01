package com.blueforce.user.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfileDto {
    private Long id;
    private String email;
    private String role;
    private String fullName;
    private String phone;
    private String avatar;
    private String bio;
}
