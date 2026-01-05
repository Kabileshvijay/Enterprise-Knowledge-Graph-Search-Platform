package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.DocumentAnalyticsDTO;
import com.enterprise.knowledge.dto.UserAnalyticsDTO;
import com.enterprise.knowledge.entity.DocumentAnalytics;
import com.enterprise.knowledge.entity.UserAnalytics;
import com.enterprise.knowledge.repository.DocumentAnalyticsRepository;
import com.enterprise.knowledge.repository.UserAnalyticsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class AnalyticsService {

    private final UserAnalyticsRepository userRepo;
    private final DocumentAnalyticsRepository docRepo;

    public AnalyticsService(
            UserAnalyticsRepository userRepo,
            DocumentAnalyticsRepository docRepo
    ) {
        this.userRepo = userRepo;
        this.docRepo = docRepo;
    }

    /* ================= TRACK DOCUMENT VIEW ================= */
    public void trackDocument(
            String email,
            Long documentId,
            String title,
            int timeSpent
    ) {

        /* ===== USER ANALYTICS ===== */
        UserAnalytics user = userRepo.findByUserEmail(email);

        if (user == null) {
            user = new UserAnalytics();
            user.setUserEmail(email);
            user.setTotalTimeMinutes(0);
            user.setDocumentsOpened(0);
        }

        user.setTotalTimeMinutes(
                user.getTotalTimeMinutes() + timeSpent
        );
        user.setDocumentsOpened(
                user.getDocumentsOpened() + 1
        );
        user.setLastActive(LocalDateTime.now());

        userRepo.save(user);

        /* ===== DOCUMENT ANALYTICS ===== */
        DocumentAnalytics doc =
                docRepo.findByUserEmailAndDocumentId(email, documentId)
                        .orElseGet(() -> {
                            DocumentAnalytics d = new DocumentAnalytics();
                            d.setUserEmail(email);
                            d.setDocumentId(documentId);
                            d.setDocumentTitle(title);
                            d.setTimeSpentMinutes(0); // 🔑 IMPORTANT FIX
                            return d;
                        });

        doc.setTimeSpentMinutes(
                doc.getTimeSpentMinutes() + timeSpent
        );
        doc.setLastOpened(LocalDateTime.now());

        docRepo.save(doc);
    }

    /* ================= FETCH USER ANALYTICS ================= */
    public UserAnalyticsDTO getUserAnalytics(String email) {

        UserAnalyticsDTO dto = new UserAnalyticsDTO();

        UserAnalytics user = userRepo.findByUserEmail(email);
        List<DocumentAnalytics> docs =
                docRepo.findByUserEmail(email);

        if (docs == null) {
            docs = List.of(); // 🔑 prevent NPE
        }

        if (user == null) {
            dto.totalTime = 0;
            dto.documentsOpened = 0;
            dto.avgTimePerDoc = 0;
            dto.mostViewedDoc = "N/A";
            dto.documents = List.of();
            return dto;
        }

        dto.totalTime = user.getTotalTimeMinutes();
        dto.documentsOpened = user.getDocumentsOpened();

        dto.avgTimePerDoc =
                user.getDocumentsOpened() == 0
                        ? 0
                        : dto.totalTime / user.getDocumentsOpened();

        dto.mostViewedDoc =
                docs.stream()
                        .max(Comparator.comparing(DocumentAnalytics::getTimeSpentMinutes))
                        .map(DocumentAnalytics::getDocumentTitle)
                        .orElse("N/A");

        dto.documents = docs.stream().map(d -> {
            DocumentAnalyticsDTO dd = new DocumentAnalyticsDTO();
            dd.documentId = d.getDocumentId();
            dd.title = d.getDocumentTitle();
            dd.timeSpent = d.getTimeSpentMinutes();
            dd.lastOpened = d.getLastOpened();
            return dd;
        }).toList();

        return dto;
    }
}
