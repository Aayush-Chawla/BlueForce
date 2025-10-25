package com.blueforce.auth.dto;

import lombok.*;

@Data @AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String email;
    private String role;
    private boolean verified;
    private String token;
}