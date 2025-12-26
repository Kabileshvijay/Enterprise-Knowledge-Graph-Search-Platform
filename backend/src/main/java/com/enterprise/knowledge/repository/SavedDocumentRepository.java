package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.SavedDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedDocumentRepository extends JpaRepository<SavedDocument, Long> {

    // ✅ Get all saved docs for a user
    List<SavedDocument> findByUserEmail(String userEmail);

    // ✅ Check if already saved (IMPORTANT)
    boolean existsByDocumentIdAndUserEmail(Long documentId, String userEmail);
}
