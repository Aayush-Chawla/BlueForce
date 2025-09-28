package com.blueforce.auth.service;

import com.blueforce.auth.dto.*;
import com.blueforce.auth.entity.*;
import com.blueforce.auth.repository.AuthUserRepository;
import com.blueforce.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthUserRepository authUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register
    public AuthResponse register(RegisterRequest request) {

        if (authUserRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        AuthUser authUser = AuthUser.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .provider(AuthProviderType.LOCAL)
                .verified(false)
                .build();

        AuthUser saved = authUserRepository.save(authUser);
        return new AuthResponse(saved.getId(), saved.getEmail(), saved.getRole(), saved.isVerified());
    }

    // ✅ Login
    public LoginResponse login(LoginRequest request) {
        AuthUser user = authUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        boolean passwordMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!passwordMatch) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new LoginResponse("Login successful", token);
    }
}
