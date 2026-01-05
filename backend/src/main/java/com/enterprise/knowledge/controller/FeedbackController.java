package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.FeedbackRequest;
import com.enterprise.knowledge.entity.Feedback;
import com.enterprise.knowledge.service.FeedbackService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    /* ================= SUBMIT FEEDBACK ================= */

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitFeedback(
            @RequestPart("data") FeedbackRequest request,
            @RequestPart(value = "screenshot", required = false) MultipartFile screenshot,
            Authentication authentication
    ) throws Exception {

        // 🔐 SAFETY CHECK
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(401).body("UNAUTHORIZED");
        }

        // ✅ JWT principal is email (String)
        String email = authentication.getPrincipal().toString();

        service.submitFeedback(request, screenshot, email);

        return ResponseEntity.ok().build();
    }

    /* ================= GET ALL FEEDBACK (ADMIN) ================= */

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(service.getAllFeedback());
    }

    /* ================= MARK AS SOLVED (ADMIN) ================= */

    @PutMapping("/{id}/solve")
    public ResponseEntity<?> markAsSolved(@PathVariable Long id) {
        service.markAsSolved(id);
        return ResponseEntity.ok("MARKED_AS_SOLVED");
    }
}
