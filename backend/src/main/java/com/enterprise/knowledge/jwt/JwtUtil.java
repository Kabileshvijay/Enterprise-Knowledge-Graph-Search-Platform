package com.enterprise.knowledge.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 🔐 SECRET KEY (min 256 bits for HS256)
    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkey123";

    // ⏰ Token validity (1 day)
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    /* ================= GENERATE TOKEN ================= */

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)   // ✅ STORE RAW ROLE (ADMIN / USER)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /* ================= EXTRACT CLAIMS ================= */

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .setAllowedClockSkewSeconds(60)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
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
