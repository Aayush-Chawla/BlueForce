package com.blueforce.auth.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private String message;
    private String token;
    private Long userId;
    private String email;
    private String role;
    private boolean verified;
}