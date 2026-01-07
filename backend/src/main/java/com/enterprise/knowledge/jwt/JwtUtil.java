package com.enterprise.knowledge.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 🔐 MUST come from Render ENV (≥ 256 bits)
    @Value("${jwt.secret}")
    private String secret;

    // ⏰ Token validity (24 hours)
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /* ================= GENERATE TOKEN ================= */

    public String generateToken(String email, String role) {

        // 🔥 IMPORTANT:
        // DB has: ADMIN / EMPLOYEE
        // Spring Security needs: ROLE_ADMIN / ROLE_EMPLOYEE
        String authority = "ROLE_" + role;

        return Jwts.builder()
                .setSubject(email)
                .claim("role", authority)
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
                .setAllowedClockSkewSeconds(60) // avoids clock drift issues
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
