package com.blueforce.event.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.util.Base64;

@Component
public class JwtTokenExtractor {
    
    @Value("${app.development.mode:true}")
    private boolean developmentMode;
    
    public Long extractUserId(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
            Jwt jwt = jwtToken.getToken();
            
            // Extract user ID from JWT claims
            // The claim name depends on how your auth-service structures the JWT
            Object userIdClaim = jwt.getClaim("sub"); // Standard JWT subject claim
            if (userIdClaim == null) {
                userIdClaim = jwt.getClaim("user_id"); // Custom claim
            }
            if (userIdClaim == null) {
                userIdClaim = jwt.getClaim("id"); // Another possible custom claim
            }
            
            if (userIdClaim != null) {
                try {
                    return Long.parseLong(userIdClaim.toString());
                } catch (NumberFormatException e) {
                    // If it's not a number, try to extract from a string
                    String userIdStr = userIdClaim.toString();
                    if (userIdStr.contains(":")) {
                        // Handle cases like "user:123" or "ngo:456"
                        String[] parts = userIdStr.split(":");
                        if (parts.length > 1) {
                            return Long.parseLong(parts[1]);
                        }
                    }
                }
            }
        }
        
        // Development mode: handle mock tokens
        if (developmentMode && authentication != null) {
            try {
                // First try to parse the authentication name directly as a number
                String authName = authentication.getName();
                if (authName != null && authName.matches("\\d+")) {
                    return Long.parseLong(authName);
                }
                
                // If that fails, try to parse mock token if it's base64 encoded
                if (authName != null && authName.length() > 10) {
                    try {
                        String decoded = new String(Base64.getDecoder().decode(authName));
                        System.out.println("Decoded token: " + decoded);
                        
                        // Parse JSON-like structure: {"sub":"123","user_id":"123",...}
                        if (decoded.contains("user_id")) {
                            String userIdStr = decoded.substring(decoded.indexOf("user_id") + 9);
                            userIdStr = userIdStr.substring(0, userIdStr.indexOf("\""));
                            System.out.println("Extracted user_id: " + userIdStr);
                            return Long.parseLong(userIdStr);
                        }
                        
                        // Also try "sub" field
                        if (decoded.contains("\"sub\"")) {
                            String userIdStr = decoded.substring(decoded.indexOf("\"sub\"") + 6);
                            userIdStr = userIdStr.substring(0, userIdStr.indexOf("\""));
                            System.out.println("Extracted sub: " + userIdStr);
                            return Long.parseLong(userIdStr);
                        }
                    } catch (Exception ex) {
                        System.out.println("Failed to parse mock token: " + ex.getMessage());
                        // Ignore parsing errors
                    }
                }
            } catch (NumberFormatException e) {
                System.out.println("Failed to parse authentication name as number: " + e.getMessage());
            }
        }
        
        // If all else fails, return a default user ID for testing
        System.out.println("Using default user ID: 2");
        return 2L; // Changed from 1L to 2L to match a participant user
    }
    
    public String extractUserRole(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken jwtToken = (JwtAuthenticationToken) authentication;
            Jwt jwt = jwtToken.getToken();
            
            Object roleClaim = jwt.getClaim("role");
            if (roleClaim == null) {
                roleClaim = jwt.getClaim("authorities");
            }
            
            if (roleClaim != null) {
                return roleClaim.toString();
            }
        }
        
        return "USER"; // Default role
    }
}
