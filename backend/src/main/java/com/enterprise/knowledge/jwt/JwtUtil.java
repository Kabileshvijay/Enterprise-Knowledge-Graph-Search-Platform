package com.enterprise.knowledge.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 🔐 Loaded from Render ENV (JWT_SECRET)
    @Value("${jwt.secret}")
    private String secret;

    private Key signingKey;

    // ⏰ Token validity (24 hours)
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    // ✅ Initialize key ONCE at startup
    @PostConstruct
    public void init() {

        if (secret == null || secret.trim().length() < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET must be at least 32 characters long"
            );
        }

        this.signingKey = Keys.hmacShaKeyFor(
                secret.trim().getBytes(StandardCharsets.UTF_8)
        );
    }

    /* ================= GENERATE TOKEN ================= */

    public String generateToken(String email, String role) {

        // DB → ADMIN / EMPLOYEE
        // Spring Security → ROLE_ADMIN / ROLE_EMPLOYEE
        String authority = role.startsWith("ROLE_")
                ? role
                : "ROLE_" + role;

        return Jwts.builder()
                .setSubject(email)
                .claim("role", authority)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /* ================= CLAIM EXTRACTION ================= */

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
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
