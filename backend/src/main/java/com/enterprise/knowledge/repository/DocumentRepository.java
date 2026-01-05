package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    /* ================= PROFILE / MY DOCUMENTS ================= */
    List<Document> findByAuthorEmail(String authorEmail);

    /* ============================================================
       🔍 SEARCH + FILTER + PAGINATION (BACKEND DRIVEN)
       ============================================================ */
    @Query("""
        SELECT d FROM Document d
        WHERE d.status = 'PUBLISHED'
          AND (:q IS NULL OR :q = ''
               OR LOWER(d.title) LIKE LOWER(CONCAT('%', :q, '%')))
          AND (:space IS NULL OR :space = ''
               OR d.category = :space)
          AND (:contributor IS NULL OR :contributor = ''
               OR d.authorEmail = :contributor)
          AND (:fromDate IS NULL
               OR d.createdAt >= :fromDate)
    """)
    Page<Document> searchDocuments(
            @Param("q") String q,
            @Param("space") String space,
            @Param("contributor") String contributor,
            @Param("fromDate") LocalDateTime fromDate,
            Pageable pageable
    );

    /* ============================================================
       👤 GET DISTINCT CONTRIBUTORS
       ============================================================ */
    @Query("""
        SELECT DISTINCT d.authorEmail
        FROM Document d
        WHERE d.status = 'PUBLISHED'
        ORDER BY d.authorEmail
    """)
    List<String> findAllContributors();

    /* ================= COUNT BY AUTHOR ================= */
    @Query("""
        SELECT COUNT(d)
        FROM Document d
        WHERE d.status = 'PUBLISHED'
          AND d.authorEmail = :email
    """)
    long countPublishedByAuthorEmail(@Param("email") String email);
}
