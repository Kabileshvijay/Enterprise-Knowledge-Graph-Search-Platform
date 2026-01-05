package com.enterprise.knowledge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_analytics")
public class UserAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private int totalTimeMinutes;

    private int documentsOpened;

    private LocalDateTime lastActive;

    public UserAnalytics() {}

    // Getters & Setters
    public Long getId() { return id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public int getTotalTimeMinutes() { return totalTimeMinutes; }
    public void setTotalTimeMinutes(int totalTimeMinutes) {
        this.totalTimeMinutes = totalTimeMinutes;
    }

    public int getDocumentsOpened() { return documentsOpened; }
    public void setDocumentsOpened(int documentsOpened) {
        this.documentsOpened = documentsOpened;
    }

    public LocalDateTime getLastActive() { return lastActive; }
    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }
}
