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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import reactor.core.publisher.Mono;
import java.util.List;

@Configuration
public class SecurityConfig {

    /**
     * WebFlux Security Filter Chain for JWT verification and role-based access
     */
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        // Open endpoints from AuthService
                        .pathMatchers("/api/auth/**", "/.well-known/jwks.json").permitAll()

                        // Role-based access for UserService
                        .pathMatchers("/api/users/me/admin/**").hasRole("ADMIN")
                        .pathMatchers("/api/users/me/ngo/**").hasRole("NGO")
                        .pathMatchers("/api/users/me/participant/**").hasRole("PARTICIPANT")

                        // All other requests require authentication
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(reactiveJwtAuthConverter()))
                );

        return http.build();
    }

    // Map "role" claim from JWT to ROLE_ authorities for WebFlux
    @Bean
    public org.springframework.core.convert.converter.Converter<Jwt, Mono<AbstractAuthenticationToken>> reactiveJwtAuthConverter() {
        JwtAuthenticationConverter delegate = new JwtAuthenticationConverter();
        delegate.setJwtGrantedAuthoritiesConverter(jwt -> {
            String role = jwt.getClaimAsString("role");
            if (role == null) return List.<GrantedAuthority>of();
            if ("VOLUNTEER".equalsIgnoreCase(role)) role = "PARTICIPANT";
            return List.<GrantedAuthority>of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        });
        return new ReactiveJwtAuthenticationConverterAdapter(delegate);
    }

    /**
     * Optional: Configure Gateway routes programmatically (alternative to application.properties)
     * Eureka-based service discovery is still used via lb://service-name
     */
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // AuthService route
                .route("auth-service", r -> r.path("/api/auth/**")
                        .uri("lb://auth-service")
                )
                // UserService route
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://user-service")
                )
                .build();
    }
}
