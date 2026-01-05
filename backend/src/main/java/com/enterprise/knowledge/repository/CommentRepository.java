package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.Comment;
import com.enterprise.knowledge.entity.Document; // ✅ IMPORTANT FIX
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    /* ================= BASIC ================= */
    List<Comment> findByDocumentIdOrderByCreatedAtAsc(Long documentId);

    /* ================= NON-DELETED COMMENTS ================= */
    List<Comment> findByDocumentIdAndIsDeletedFalseOrderByCreatedAtAsc(Long documentId);

    /* ================= ROOT COMMENTS (NO PARENT) ================= */
    List<Comment> findByDocumentIdAndParentIdIsNullAndIsDeletedFalseOrderByCreatedAtAsc(
            Long documentId
    );

    /* ================= REPLIES ================= */
    List<Comment> findByParentIdAndIsDeletedFalseOrderByCreatedAtAsc(Long parentId);

    /* ================= COUNT COMMENTS ================= */
    long countByDocumentId(Long documentId);

    /* ================= COUNT ONLY VISIBLE COMMENTS ================= */
    long countByDocumentIdAndIsDeletedFalse(Long documentId);

    /* ================= COUNT COMMENTS FOR AUTHOR ================= */
    @Query("""
        SELECT COUNT(c)
        FROM Comment c
        JOIN Document d ON c.documentId = d.id
        WHERE d.authorEmail = :email
          AND c.isDeleted = false
    """)
    long countCommentsByAuthorEmail(@Param("email") String email);
}
