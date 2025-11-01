package com.blueforce.auth.controller;

import com.blueforce.auth.dto.*;
import com.blueforce.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.blueforce.auth.repository.AuthUserRepository authUserRepository;

    @Autowired
    private com.blueforce.auth.util.JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @jakarta.validation.Valid RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @jakarta.validation.Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validate(@RequestHeader(name = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(java.util.Map.of(
                "success", false,
                "message", "Missing or invalid Authorization header"
            ));
        }
        String token = authorization.substring(7);
        try {
            String email = jwtUtil.extractEmail(token);
            return authUserRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(java.util.Map.of(
                        "success", true,
                        "message", "Token is valid",
                        "data", java.util.Map.of(
                                "userId", user.getId(),
                                "email", user.getEmail(),
                                "role", user.getRole(),
                                "verified", user.isVerified()
                        )
                )))
                .orElse(ResponseEntity.status(401).body(java.util.Map.of(
                        "success", false,
                        "message", "User not found"
                )));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(java.util.Map.of(
                    "success", false,
                    "message", "Invalid token"
            ));
        }
    }
}
