package com.blueforce.event.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;
    
    @NotNull(message = "Date and time is required")
    @Future(message = "Event date must be in the future")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateTime;
    
    @Min(value = 1, message = "Maximum participants must be at least 1")
    private Integer maxParticipants;
    
    @Email(message = "Contact email must be valid")
    private String contactEmail;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Contact phone must be valid")
    private String contactPhone;
}
