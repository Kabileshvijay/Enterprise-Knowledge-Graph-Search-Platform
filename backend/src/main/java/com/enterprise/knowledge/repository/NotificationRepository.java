package com.enterprise.knowledge.repository;

import com.enterprise.knowledge.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String email);

    long countByRecipientEmailAndIsReadFalse(String email);
    void deleteByCreatedAtBefore(LocalDateTime time);

}
