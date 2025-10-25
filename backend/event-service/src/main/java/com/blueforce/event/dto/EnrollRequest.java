package com.blueforce.event.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    // Optional message from volunteer
    private String message;
}
