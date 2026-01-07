package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.SummaryRequest;
import com.enterprise.knowledge.service.AISummaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://entrograph.vercel.app"
        },
        allowCredentials = "true"
)
public class AISummaryController {

    private final AISummaryService service;

    public AISummaryController(AISummaryService service) {
        this.service = service;
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarize(
            @RequestBody SummaryRequest request
    ) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("summary", "Content is empty."));
        }

        try {
            String summary = service.summarize(request.getContent());
            return ResponseEntity.ok(Map.of("summary", summary));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(503)
                    .body(Map.of("summary", "AI service temporarily unavailable."));
        }
    }
}
