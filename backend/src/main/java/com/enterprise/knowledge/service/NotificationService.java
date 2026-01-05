package com.enterprise.knowledge.service;

import com.enterprise.knowledge.entity.Notification;
import com.enterprise.knowledge.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(
            NotificationRepository repository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    /* ================= CREATE & PUSH NOTIFICATION ================= */

    public void notifyUser(
            String recipientEmail,
            String actorName,      // who did the action
            String action,         // "liked" | "commented on"
            String documentTitle,
            Long documentId
    ) {
        Notification n = new Notification();
        n.setRecipientEmail(recipientEmail);
        n.setDocumentId(documentId);

        // ✅ SINGLE SOURCE OF MESSAGE FORMAT
        n.setMessage(
                actorName + " " + action + " your document: " + documentTitle
        );

        Notification saved = repository.save(n);

        // 🔔 REAL-TIME PUSH
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + recipientEmail,
                saved
        );
    }

    /* ================= FETCH USER NOTIFICATIONS ================= */

    public List<Notification> getUserNotifications(String email) {
        return repository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    /* ================= UNREAD COUNT ================= */

    public long getUnreadCount(String email) {
        return repository.countByRecipientEmailAndIsReadFalse(email);
    }

    /* ================= MARK AS READ ================= */

    public void markAsRead(Long id) {
        Notification n = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("NOTIFICATION_NOT_FOUND"));
        n.setRead(true);
        repository.save(n);
    }
}
