package com.blueforce.api_gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.security.web.server.authorization.HttpStatusServerAccessDeniedHandler;
import reactor.core.publisher.Mono;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    /**
     * Configure ReactiveJwtDecoder for WebFlux
     * This explicitly creates a JWT decoder that fetches JWKS from the auth-service
     */
    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri)
                .build();
    }

    /**
     * WebFlux Security Filter Chain for JWT verification and role-based access
     */
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                // CORS is handled by CorsWebFilter bean from CorsConfig
                // Don't use .cors() here to avoid duplicate headers
                .authorizeExchange(exchanges -> exchanges
                        // Always allow CORS preflight requests FIRST
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public read endpoints - allow anonymous access
                        // Match both /api/events and /api/events/**
                        .pathMatchers(HttpMethod.GET, "/api/events", "/api/events/**").permitAll()
                        // Event write endpoints - require authentication
                        .pathMatchers(HttpMethod.POST, "/api/events", "/api/events/**").authenticated()
                        .pathMatchers(HttpMethod.PUT, "/api/events", "/api/events/**").authenticated()
                        .pathMatchers(HttpMethod.DELETE, "/api/events", "/api/events/**").authenticated()
                        // Open endpoints from AuthService
                        .pathMatchers("/api/auth/**", "/.well-known/jwks.json").permitAll()

                        // Role-based access for UserService - more specific paths first
                        .pathMatchers("/api/users/me/admin/**").hasAnyRole("ADMIN", "SUPERADMIN")
                        .pathMatchers("/api/users/me/ngo/**").hasRole("NGO")
                        .pathMatchers("/api/users/me/participant/**").hasRole("PARTICIPANT")
                        .pathMatchers("/api/users/me").authenticated()  // Allow any authenticated user to get their own profile
                        .pathMatchers("/api/users").hasAnyRole("ADMIN", "SUPERADMIN")  // List users endpoint
                        .pathMatchers("/api/users/**").hasAnyRole("ADMIN", "SUPERADMIN")  // Other user endpoints

                        // All other requests require authentication
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtDecoder(jwtDecoder())
                                .jwtAuthenticationConverter(reactiveJwtAuthConverter())
                        )
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler(new HttpStatusServerAccessDeniedHandler(HttpStatus.FORBIDDEN))
                );

        return http.build();
    }

    // Map "role" claim from JWT to ROLE_ authorities for WebFlux
    @Bean
    public org.springframework.core.convert.converter.Converter<Jwt, Mono<AbstractAuthenticationToken>> reactiveJwtAuthConverter() {
        JwtAuthenticationConverter delegate = new JwtAuthenticationConverter();
        delegate.setJwtGrantedAuthoritiesConverter(jwt -> {
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
        return new ReactiveJwtAuthenticationConverterAdapter(delegate);
    }

    /**
     * Gateway routes are configured in application.properties
     * This method is kept for reference but routes are defined in properties file
     */
}
