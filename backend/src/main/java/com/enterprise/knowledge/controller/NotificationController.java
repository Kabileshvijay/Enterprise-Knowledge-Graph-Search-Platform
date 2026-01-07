package com.enterprise.knowledge.controller;

import com.enterprise.knowledge.entity.Notification;
import com.enterprise.knowledge.service.NotificationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Notification> getMyNotifications() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return service.getUserNotifications(email);
    }

    @GetMapping("/count")
    public long getUnreadCount() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return service.getUnreadCount(email);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
    }
}
