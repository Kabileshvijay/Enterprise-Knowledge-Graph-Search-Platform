package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.DocumentRequest;
import com.enterprise.knowledge.dto.DocumentSearchResponse;
import com.enterprise.knowledge.entity.Document;
import com.enterprise.knowledge.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class DocumentController {

    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    /* ================= CREATE DOCUMENT ================= */
    @PostMapping
    public ResponseEntity<Document> createDocument(
            @RequestBody DocumentRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(service.createDocument(request, email));
    }

    /* ================= GET ALL DOCUMENTS ================= */
    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(service.getAllDocuments());
    }

    /* =====================================================
       🔍 SEARCH + FILTER + PAGINATION (BACKEND DRIVEN)
       ===================================================== */
    @GetMapping("/search")
    public ResponseEntity<DocumentSearchResponse> searchDocuments(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String space,
            @RequestParam(required = false) String contributor,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String date,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                service.search(q, space, contributor, tags, date, page, size)
        );
    }

    /* ================= NEW: GET CONTRIBUTORS ================= */
    @GetMapping("/contributors")
    public ResponseEntity<List<String>> getContributors() {
        return ResponseEntity.ok(service.getAllContributors());
    }

    /* ================= LIKE DOCUMENT ================= */
    @PutMapping("/{id}/like")
    public ResponseEntity<?> likeDocument(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();

        try {
            Document doc = service.likeDocument(id, email);
            return ResponseEntity.ok(doc);

        } catch (RuntimeException e) {
            if ("ALREADY_LIKED".equals(e.getMessage())) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Already liked"));
            }
            throw e;
        }
    }

    /* ================= SAVE / UNSAVE DOCUMENT ================= */
    @PutMapping("/{id}/save")
    public ResponseEntity<Map<String, String>> saveDocument(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        service.toggleSave(id, email);
        return ResponseEntity.ok(
                Map.of("message", "Save state toggled successfully")
        );
    }

    /* ================= GET SAVED DOCUMENTS ================= */
    @GetMapping("/saved")
    public ResponseEntity<List<Document>> getSavedDocuments(
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(service.getSavedDocuments(email));
    }

    /* ================= GET MY DOCUMENTS ================= */
    @GetMapping("/my")
    public ResponseEntity<List<Document>> getMyDocuments(
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(service.getDocumentsByAuthor(email));
    }

    /* ================= UPDATE DOCUMENT ================= */
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @RequestBody DocumentRequest request
    ) {
        return ResponseEntity.ok(service.updateDocument(id, request));
    }

    /* ================= DELETE DOCUMENT ================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        service.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    /* ================= GET DOCUMENT BY ID ================= */
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDocumentById(id));
    }
}
