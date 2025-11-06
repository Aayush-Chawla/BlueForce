package com.blueforce.api_gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Global filter to forward Authorization header to downstream services.
 * This ensures that when the API Gateway validates a JWT, it forwards
 * the original Authorization header to downstream services so they can
 * also validate the token.
 */
@Component
public class ForwardAuthHeaderFilter implements GlobalFilter, Ordered {
    
    private static final Logger log = LoggerFactory.getLogger(ForwardAuthHeaderFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String method = request.getMethod().name();
        String path = request.getURI().getPath();
        String authHeader = request.getHeaders().getFirst("Authorization");
        
        log.info("=== FORWARD AUTH HEADER FILTER ===");
        log.info("Request: {} {}", method, path);
        log.info("Authorization header present: {}", authHeader != null && !authHeader.isEmpty());
        
        // If Authorization header exists in the original request, ensure it's forwarded
        if (authHeader != null && !authHeader.isEmpty()) {
            log.info("Forwarding Authorization header to downstream service");
            // Explicitly set the header to ensure it's forwarded to downstream services
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("Authorization", authHeader)
                    .build();
            
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        }
        
        // If no Authorization header but we have JWT in security context, extract and forward it
        return ReactiveSecurityContextHolder.getContext()
                .cast(SecurityContext.class)
                .map(securityContext -> {
                    Authentication authentication = securityContext.getAuthentication();
                    log.info("Security context authentication type: {}", 
                        authentication != null ? authentication.getClass().getSimpleName() : "null");
                    
                    if (authentication instanceof JwtAuthenticationToken) {
                        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) authentication;
                        Jwt jwt = jwtAuth.getToken();
                        String tokenValue = jwt.getTokenValue();
                        
                        log.info("Extracting JWT from security context and forwarding");
                        ServerHttpRequest mutatedRequest = request.mutate()
                                .header("Authorization", "Bearer " + tokenValue)
                                .build();
                        
                        return exchange.mutate().request(mutatedRequest).build();
                    }
                    log.warn("No JWT authentication found in security context");
                    return exchange;
                })
                .defaultIfEmpty(exchange)
                .doOnSuccess(ex -> log.info("Filter completed successfully"))
                .doOnError(error -> log.error("Filter error: {}", error.getMessage(), error))
                .flatMap(chain::filter);
    }

    @Override
    public int getOrder() {
        // Run after security filters (which run at HIGHEST_PRECEDENCE) but before routing
        return Ordered.HIGHEST_PRECEDENCE + 100;
    }
}

