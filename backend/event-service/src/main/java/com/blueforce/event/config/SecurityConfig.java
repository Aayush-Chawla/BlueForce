package com.blueforce.event.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;
    
    @Autowired
    private DevelopmentAuthenticationFilter developmentAuthenticationFilter;
    
    @Value("${app.development.mode:true}")
    private boolean developmentMode;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Health endpoints - no authentication required
                .requestMatchers("/health/**", "/actuator/**").permitAll()
                
                // Event GET endpoints - allow public access for viewing events
                .requestMatchers("GET", "/api/events").permitAll()
                .requestMatchers("GET", "/api/events/*").permitAll()
                
                // Event POST/PUT/DELETE endpoints - require authentication
                .requestMatchers("POST", "/api/events/**").authenticated()
                .requestMatchers("PUT", "/api/events/**").authenticated()
                .requestMatchers("DELETE", "/api/events/**").authenticated()
                
                // Event participant endpoints - require authentication
                .requestMatchers("/api/events/*/enroll").authenticated()
                .requestMatchers("/api/events/*/participants/**").authenticated()
                
                // All other requests require authentication
                .anyRequest().authenticated()
            );
        
        // Add development authentication filter before JWT validation
        if (developmentMode) {
            http.addFilterBefore(developmentAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        }
        
        // Only enable JWT validation if not in development mode
        if (!developmentMode) {
            http.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwkSetUri("http://localhost:8081/.well-known/jwks.json"))
            );
        }
        
        return http.build();
    }
}
