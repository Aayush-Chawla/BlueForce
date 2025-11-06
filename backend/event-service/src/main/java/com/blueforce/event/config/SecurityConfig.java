package com.blueforce.event.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

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
                .requestMatchers("GET", "/api/events", "/api/events/**").permitAll()
                
                // Event POST/PUT/DELETE endpoints - require authentication
                .requestMatchers("POST", "/api/events", "/api/events/**").authenticated()
                .requestMatchers("PUT", "/api/events", "/api/events/**").authenticated()
                .requestMatchers("DELETE", "/api/events", "/api/events/**").authenticated()
                
                // Event participant endpoints - require authentication
                .requestMatchers("/api/events/**/enroll").authenticated()
                .requestMatchers("/api/events/**/participants/**").authenticated()
                
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
                .jwt(jwt -> jwt
                    .jwkSetUri("http://auth-service:8081/.well-known/jwks.json")
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );
        }
        
        return http.build();
    }
    
    /**
     * Custom JWT Authentication Converter to ensure authenticated users
     * always have at least one authority, preventing 403 errors.
     */
    @Bean
    public Converter<Jwt, AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            try {
                String role = jwt.getClaimAsString("role");
                
                // Always ensure at least one authority is returned
                // This is critical for .authenticated() checks to pass
                if (role == null || role.trim().isEmpty()) {
                    // If no role claim, grant a default authenticated authority
                    // This ensures .authenticated() checks pass even without explicit roles
                    return List.<GrantedAuthority>of(new SimpleGrantedAuthority("ROLE_AUTHENTICATED"));
                }
                
                if ("VOLUNTEER".equalsIgnoreCase(role)) role = "PARTICIPANT";

                String normalizedRole = role.toUpperCase().trim();
                
                // Grant both SUPERADMIN and ADMIN authorities for superadmin role
                if ("SUPERADMIN".equals(normalizedRole)) {
                    return List.of(
                        new SimpleGrantedAuthority("ROLE_SUPERADMIN"),
                        new SimpleGrantedAuthority("ROLE_ADMIN")
                    );
                }

                // Always return at least one authority
                return List.<GrantedAuthority>of(new SimpleGrantedAuthority("ROLE_" + normalizedRole));
            } catch (Exception e) {
                // Fallback: always return at least one authority even if there's an error
                // This prevents authentication failures due to empty authority lists
                return List.<GrantedAuthority>of(new SimpleGrantedAuthority("ROLE_AUTHENTICATED"));
            }
        });
        return converter;
    }
}
