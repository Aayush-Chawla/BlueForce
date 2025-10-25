package com.blueforce.auth.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.util.Date;

import static javax.crypto.Cipher.SECRET_KEY;

@Component
public class JwtUtil {

    private final KeyPair keyPair;

    public JwtUtil(com.blueforce.auth.config.RsaKeyConfig rsaKeyConfig) {
        this.keyPair = rsaKeyConfig.getKeyPair();
    }

    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    public String generateToken(String email, String role, Long userId) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .claim("user_id", userId)  // Add user ID claim
                .claim("id", userId)       // Add alternative ID claim
                .setIssuer("blueforce-auth-service")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .setHeaderParam("kid", "key-1")        // include Key ID
                .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
                .compact();
    }


    public Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(String.valueOf(Cipher.SECRET_KEY))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token, String email) {
        return email.equals(extractEmail(token)) &&
                !extractClaims(token).getExpiration().before(new Date());
    }
}
