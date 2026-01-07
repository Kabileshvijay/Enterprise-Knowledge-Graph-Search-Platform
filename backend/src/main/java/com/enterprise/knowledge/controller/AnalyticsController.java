package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.UserAnalyticsDTO;
import com.enterprise.knowledge.service.AnalyticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://entrograph.vercel.app"
        },
        allowCredentials = "true"
)
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    /* ================= TRACK DOCUMENT VIEW ================= */
    @PostMapping("/track")
    public ResponseEntity<Void> trackDocument(
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();

        Long documentId = Long.valueOf(payload.get("documentId").toString());
        String title = payload.get("title").toString();
        int timeSpent = Integer.parseInt(payload.get("timeSpent").toString());

        service.trackDocument(email, documentId, title, timeSpent);

        return ResponseEntity.ok().build();
    }

    /* ================= GET LOGGED-IN USER ANALYTICS ================= */
    @GetMapping("/user")
    public ResponseEntity<UserAnalyticsDTO> getUserAnalytics(
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();

        // 🔍 Debug (temporary)
        System.out.println("Fetching analytics for: " + email);

        return ResponseEntity.ok(service.getUserAnalytics(email));
    }
}
