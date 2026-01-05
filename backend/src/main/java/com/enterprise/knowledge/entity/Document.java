package com.enterprise.knowledge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "documents",
        indexes = {
                @Index(name = "idx_document_title", columnList = "title"),
                @Index(name = "idx_document_category", columnList = "category"),
                @Index(name = "idx_document_author", columnList = "authorName"),
                @Index(name = "idx_document_status", columnList = "status"),
                @Index(name = "idx_document_created_at", columnList = "createdAt")
        }
)
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ================= BASIC INFO ================= */

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false)
    private String authorEmail;

    @Column(nullable = false)
    private String category;   // Space (Engineering, Analytics...)

    /* ================= CONTENT ================= */

    @Column(columnDefinition = "TEXT")
    private String tags;       // comma-separated labels

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    /* ================= STATUS & META ================= */

    @Column(nullable = false)
    private String status;     // PUBLISHED / DRAFT

    @Column(nullable = false)
    private Integer likes = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /* ================= UI-ONLY FIELDS ================= */
    // ❗ NOT stored in DB

    @Transient
    private long likeCount;

    @Transient
    private long commentCount;

    /* ================= CONSTRUCTORS ================= */

    public Document() {
        this.createdAt = LocalDateTime.now();
        this.likes = 0;
        this.status = "DRAFT";
    }

    /* ================= GETTERS & SETTERS ================= */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /* ================= TRANSIENT GETTERS ================= */

    public long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(long likeCount) {
        this.likeCount = likeCount;
    }

    public long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(long commentCount) {
        this.commentCount = commentCount;
    }
}
