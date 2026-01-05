package com.enterprise.knowledge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_analytics")
public class DocumentAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private Long documentId;

    private String documentTitle;

    private int timeSpentMinutes;

    private LocalDateTime lastOpened;

    public DocumentAnalytics() {}

    // Getters & Setters
    public Long getId() { return id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getDocumentTitle() { return documentTitle; }
    public void setDocumentTitle(String documentTitle) {
        this.documentTitle = documentTitle;
    }

    public int getTimeSpentMinutes() { return timeSpentMinutes; }
    public void setTimeSpentMinutes(int timeSpentMinutes) {
        this.timeSpentMinutes = timeSpentMinutes;
    }

    public LocalDateTime getLastOpened() { return lastOpened; }
    public void setLastOpened(LocalDateTime lastOpened) {
        this.lastOpened = lastOpened;
    }
}
