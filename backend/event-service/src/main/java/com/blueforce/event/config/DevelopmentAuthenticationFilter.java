package com.blueforce.event.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Base64;
import java.util.Collections;

@Component
public class DevelopmentAuthenticationFilter extends OncePerRequestFilter {
    
    @Value("${app.development.mode:true}")
    private boolean developmentMode;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        logger.info("=== DEVELOPMENT AUTH FILTER DEBUG ===");
        logger.info("Development mode: {}", developmentMode);
        logger.info("Request URI: {}", request.getRequestURI());
        logger.info("Request method: {}", request.getMethod());
        
        if (developmentMode) {
            String authHeader = request.getHeader("Authorization");
            logger.info("Authorization header: {}", authHeader);
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                logger.info("Token: {}", token);
                
                // Check if this is a mock token (base64 encoded JSON)
                if (isMockToken(token)) {
                    logger.info("Detected mock token, creating authentication");
                    try {
                        Authentication auth = createMockAuthentication(token);
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        logger.info("Mock authentication set successfully");
                    } catch (Exception e) {
                        // If mock token parsing fails, let it fall through to JWT validation
                        logger.error("Failed to parse mock token: " + e.getMessage(), e);
                    }
                } else {
                    logger.info("Token is not a mock token, skipping");
                }
            } else {
                logger.info("No Authorization header or not Bearer token");
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean isMockToken(String token) {
        try {
            // Try to decode as base64
            String decoded = new String(Base64.getDecoder().decode(token));
            // Check if it looks like our mock token format
            return decoded.contains("user_id") && decoded.contains("role");
        } catch (Exception e) {
            return false;
        }
    }
    
    private Authentication createMockAuthentication(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            
            // Extract user ID
            String userId = "1"; // default
            if (decoded.contains("user_id")) {
                String userIdStr = decoded.substring(decoded.indexOf("user_id") + 9);
                userIdStr = userIdStr.substring(0, userIdStr.indexOf("\""));
                userId = userIdStr;
            }
            
            // Extract role
            String role = "USER"; // default
            if (decoded.contains("role")) {
                String roleStr = decoded.substring(decoded.indexOf("role") + 7);
                roleStr = roleStr.substring(0, roleStr.indexOf("\""));
                role = roleStr;
            }
            
            // Create authentication object
            return new UsernamePasswordAuthenticationToken(
                userId, 
                null, 
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
            );
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse mock token", e);
        }
    }
}
