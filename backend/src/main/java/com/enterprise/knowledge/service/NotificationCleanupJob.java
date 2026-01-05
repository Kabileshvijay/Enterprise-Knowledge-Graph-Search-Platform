package com.enterprise.knowledge.service;

import com.enterprise.knowledge.repository.NotificationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationCleanupJob {

    private final NotificationRepository repository;

    public NotificationCleanupJob(NotificationRepository repository) {
        this.repository = repository;
    }

    // ⏰ Runs every day at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldNotifications() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
        repository.deleteByCreatedAtBefore(cutoff);
    }
}
