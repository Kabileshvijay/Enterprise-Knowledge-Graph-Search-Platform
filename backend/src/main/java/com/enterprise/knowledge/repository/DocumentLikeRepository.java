package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.DocumentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentLikeRepository
        extends JpaRepository<DocumentLike, Long> {

    boolean existsByEmployeeIdAndDocumentId(Long employeeId, Long documentId);

    long countByDocumentId(Long documentId);

    @Query("""
        SELECT COUNT(dl)
        FROM DocumentLike dl
        JOIN Document d ON dl.documentId = d.id
        WHERE d.authorEmail = :email
          AND d.status = 'PUBLISHED'
    """)
    long countLikesByAuthorEmail(@Param("email") String email);
}
