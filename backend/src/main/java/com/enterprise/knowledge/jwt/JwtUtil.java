package com.enterprise.knowledge.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 🔐 SECRET KEY (from Render env: jwt.secret)
    @Value("${jwt.secret}")
    private String secret;

    // ⏰ Token validity (1 day)
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    private Key getSigningKey() {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("JWT secret is missing or too short");
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /* ================= GENERATE TOKEN ================= */

    public String generateToken(String email, String role) {

        // ✅ ROLE IS USED AS-IS (ADMIN / EMPLOYEE)
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /* ================= CLAIM EXTRACTION ================= */

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .setAllowedClockSkewSeconds(60)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        try {
            return getClaims(token).getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            return getClaims(token).get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    /* ================= VALIDATION ================= */

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
