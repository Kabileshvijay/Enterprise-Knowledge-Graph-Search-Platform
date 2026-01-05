package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.DocumentAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentAnalyticsRepository
        extends JpaRepository<DocumentAnalytics, Long> {

    List<DocumentAnalytics> findByUserEmail(String userEmail);

    Optional<DocumentAnalytics>
    findByUserEmailAndDocumentId(String userEmail, Long documentId);
}
