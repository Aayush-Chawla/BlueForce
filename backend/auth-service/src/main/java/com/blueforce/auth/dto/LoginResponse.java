package com.blueforce.auth.dto;

import lombok.*;

@Data @AllArgsConstructor
public class LoginResponse {
    private String message;
    private String token;
}