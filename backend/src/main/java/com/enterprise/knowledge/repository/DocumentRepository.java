package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    // (Profile page)
    List<Document> findByAuthorEmail(String authorEmail);

    // NEW (Search functionality)
    List<Document> findByTitleContainingIgnoreCase(String keyword);
}
