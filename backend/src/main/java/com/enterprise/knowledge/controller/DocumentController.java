package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.dto.DocumentRequest;
import com.enterprise.knowledge.entity.Document;
import com.enterprise.knowledge.service.DocumentService;
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

    /* ================= SEARCH DOCUMENTS ================= */
    @GetMapping("/search")
    public ResponseEntity<List<Document>> searchDocuments(
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(service.searchDocuments(keyword));
    }

    /* ================= LIKE DOCUMENT ================= */
    @PutMapping("/{id}/like")
    public ResponseEntity<Document> likeDocument(@PathVariable Long id) {
        return ResponseEntity.ok(service.likeDocument(id));
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

    /* ================= GET MY DOCUMENTS (PROFILE PAGE) ================= */
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
