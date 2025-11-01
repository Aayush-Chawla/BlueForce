package com.blueforce.auth.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor
public class LoginRequest {
    @jakarta.validation.constraints.Email
    @jakarta.validation.constraints.NotBlank
    private String email;

    @jakarta.validation.constraints.NotBlank
    private String password;
}