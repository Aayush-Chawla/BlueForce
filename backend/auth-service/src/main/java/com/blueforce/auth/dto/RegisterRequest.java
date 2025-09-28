package com.blueforce.auth.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String role;  // ADMIN, NGO, PARTICIPANT
}