package com.enterprise.knowledge.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "saved_documents",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_email", "document_id"})
        }
)
public class SavedDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    public SavedDocument() {}

    public SavedDocument(Long documentId, String userEmail) {
        this.documentId = documentId;
        this.userEmail = userEmail;
    }

    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public Long getDocumentId() {
        return documentId;
    }
}
