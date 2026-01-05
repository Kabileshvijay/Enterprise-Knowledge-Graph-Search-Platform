package com.enterprise.knowledge.service;

import com.enterprise.knowledge.entity.Comment;
import com.enterprise.knowledge.entity.Document;
import com.enterprise.knowledge.repository.CommentRepository;
import com.enterprise.knowledge.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository repository;
    private final DocumentRepository documentRepository;
    private final NotificationService notificationService;

    public CommentService(
            CommentRepository repository,
            DocumentRepository documentRepository,
            NotificationService notificationService
    ) {
        this.repository = repository;
        this.documentRepository = documentRepository;
        this.notificationService = notificationService;
    }

    /* ================= GET COMMENTS (NON-DELETED) ================= */
    public List<Comment> getComments(Long documentId) {
        return repository
                .findByDocumentIdAndIsDeletedFalseOrderByCreatedAtAsc(documentId);
    }

    /* ================= ADD COMMENT (WITH NOTIFICATION) ================= */
    public Comment addComment(Comment comment) {

        boolean isNewComment = (comment.getId() == null);

        Comment saved = repository.save(comment);

        // 🔔 Notify only for NEW comments
        if (isNewComment) {

            Document doc = documentRepository.findById(comment.getDocumentId())
                    .orElseThrow(() -> new RuntimeException("DOCUMENT_NOT_FOUND"));

            // avoid self-notification
            if (!doc.getAuthorEmail().equals(comment.getAuthorEmail())) {
                notificationService.notifyUser(
                        doc.getAuthorEmail(),
                        comment.getAuthorName(),
                        "commented on",
                        doc.getTitle(),
                        doc.getId()
                );
            }
        }

        return saved;
    }

    /* ================= GET COMMENT BY ID ================= */
    public Comment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("COMMENT_NOT_FOUND")
                );
    }

    /* ================= COUNT COMMENTS (USED IN DOCUMENT LIST) ================= */
    public long countVisibleComments(Long documentId) {
        return repository.countByDocumentIdAndIsDeletedFalse(documentId);
    }

    /* ================= SOFT DELETE COMMENT (OPTIONAL) ================= */
    public void deleteComment(Long commentId) {

        Comment comment = repository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("COMMENT_NOT_FOUND"));

        comment.setIsDeleted(true);
        repository.save(comment);
    }
}
