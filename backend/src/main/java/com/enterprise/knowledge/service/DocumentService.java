package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.DocumentRequest;
import com.enterprise.knowledge.dto.DocumentSearchResponse;
import com.enterprise.knowledge.entity.Document;
import com.enterprise.knowledge.entity.DocumentLike;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.entity.SavedDocument;
import com.enterprise.knowledge.repository.CommentRepository;
import com.enterprise.knowledge.repository.DocumentLikeRepository;
import com.enterprise.knowledge.repository.DocumentRepository;
import com.enterprise.knowledge.repository.EmployeeRepository;
import com.enterprise.knowledge.repository.SavedDocumentRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository repository;
    private final SavedDocumentRepository savedRepo;
    private final EmployeeRepository employeeRepository;
    private final DocumentLikeRepository documentLikeRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    public DocumentService(
            DocumentRepository repository,
            SavedDocumentRepository savedRepo,
            EmployeeRepository employeeRepository,
            DocumentLikeRepository documentLikeRepository,
            CommentRepository commentRepository,
            NotificationService notificationService
    ) {
        this.repository = repository;
        this.savedRepo = savedRepo;
        this.employeeRepository = employeeRepository;
        this.documentLikeRepository = documentLikeRepository;
        this.commentRepository = commentRepository;
        this.notificationService = notificationService;
    }

    /* ================= CREATE DOCUMENT ================= */

    public Document createDocument(DocumentRequest request, String authorEmail) {

        Employee employee = employeeRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("AUTHOR_NOT_FOUND"));

        Document doc = new Document();
        doc.setTitle(request.getTitle());
        doc.setAuthorName(employee.getName());
        doc.setAuthorEmail(authorEmail);
        doc.setCategory(request.getCategory());
        doc.setContent(request.getContent());
        doc.setStatus(request.getStatus());
        doc.setTags(String.join(",", request.getTags()));
        doc.setLikes(0);

        return repository.save(doc);
    }

    /* ================= GET ALL DOCUMENTS ================= */

    public List<Document> getAllDocuments() {
        return repository.findAll();
    }

    /* =====================================================
       🔍 SEARCH + FILTER + PAGINATION (COUNTS FIXED)
       ===================================================== */

    public DocumentSearchResponse search(
            String q,
            String space,
            String contributor,
            String tags,
            String date,
            int page,
            int size
    ) {

        /* ===== DATE FILTER ===== */
        LocalDateTime fromDate = null;
        LocalDateTime now = LocalDateTime.now();

        if (date != null) {
            switch (date) {
                case "day" -> fromDate = now.minusDays(1);
                case "week" -> fromDate = now.minusWeeks(1);
                case "month" -> fromDate = now.minusMonths(1);
            }
        }

        /* ===== FETCH DOCUMENTS ===== */
        List<Document> allDocs = repository.searchDocuments(
                q,
                space,
                contributor,
                fromDate,
                Pageable.unpaged()
        ).getContent();

        /* ===== TAG FILTER ===== */
        if (tags != null && !tags.isBlank()) {

            List<String> selectedTags = List.of(tags.split(","))
                    .stream()
                    .map(t -> t.trim().toLowerCase())
                    .toList();

            allDocs = allDocs.stream()
                    .filter(doc -> {
                        if (doc.getTags() == null || doc.getTags().isBlank()) {
                            return false;
                        }

                        List<String> docTags = List.of(doc.getTags().split(","))
                                .stream()
                                .map(t -> t.trim().toLowerCase())
                                .toList();

                        return selectedTags.stream().allMatch(docTags::contains);
                    })
                    .toList();
        }

        /* ===== MANUAL PAGINATION ===== */
        int totalElements = allDocs.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);

        List<Document> paginatedDocs = allDocs.subList(fromIndex, toIndex);

        /* ===== ADD LIKE & COMMENT COUNTS (✅ ONLY ADDITION) ===== */
        paginatedDocs.forEach(doc -> {
            doc.setLikeCount(doc.getLikes());
            doc.setCommentCount(
                    commentRepository.countByDocumentIdAndIsDeletedFalse(
                            doc.getId()
                    )
            );
        });

        return new DocumentSearchResponse(
                paginatedDocs,
                totalPages,
                totalElements
        );
    }

    /* ================= GET CONTRIBUTORS ================= */

    public List<String> getAllContributors() {
        return repository.findAllContributors();
    }

    /* ================= GET MY DOCUMENTS ================= */

    public List<Document> getDocumentsByAuthor(String email) {
        return repository.findByAuthorEmail(email);
    }

    /* ================= UPDATE DOCUMENT ================= */

    public Document updateDocument(Long id, DocumentRequest request) {

        Document doc = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("DOCUMENT_NOT_FOUND"));

        doc.setTitle(request.getTitle());
        doc.setCategory(request.getCategory());
        doc.setContent(request.getContent());
        doc.setStatus(request.getStatus());
        doc.setTags(String.join(",", request.getTags()));

        return repository.save(doc);
    }

    /* ================= DELETE DOCUMENT ================= */

    public void deleteDocument(Long id) {
        repository.deleteById(id);
    }

    /* ================= LIKE DOCUMENT ================= */

    @Transactional
    public Document likeDocument(Long documentId, String userEmail) {

        Employee employee = employeeRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        boolean alreadyLiked =
                documentLikeRepository.existsByEmployeeIdAndDocumentId(
                        employee.getId(), documentId
                );

        if (alreadyLiked) {
            throw new RuntimeException("ALREADY_LIKED");
        }

        documentLikeRepository.save(
                new DocumentLike(employee.getId(), documentId)
        );

        Document doc = repository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("DOCUMENT_NOT_FOUND"));

        doc.setLikes(doc.getLikes() + 1);
        Document savedDoc = repository.save(doc);

        if (!doc.getAuthorEmail().equals(userEmail)) {
            notificationService.notifyUser(
                    doc.getAuthorEmail(),
                    employee.getName(),
                    "liked",
                    doc.getTitle(),
                    doc.getId()
            );
        }

        return savedDoc;
    }

    /* ================= GET DOCUMENT BY ID ================= */

    public Document getDocumentById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("DOCUMENT_NOT_FOUND"));
    }

    /* ================= SAVE / UNSAVE DOCUMENT ================= */

    public void toggleSave(Long documentId, String userEmail) {

        boolean alreadySaved =
                savedRepo.existsByDocumentIdAndUserEmail(documentId, userEmail);

        if (alreadySaved) {
            savedRepo.deleteAll(
                    savedRepo.findByUserEmail(userEmail)
                            .stream()
                            .filter(s -> s.getDocumentId().equals(documentId))
                            .toList()
            );
        } else {
            savedRepo.save(new SavedDocument(documentId, userEmail));
        }
    }

    /* ================= GET SAVED DOCUMENTS ================= */

    public List<Document> getSavedDocuments(String userEmail) {

        List<Long> docIds = savedRepo.findByUserEmail(userEmail)
                .stream()
                .map(SavedDocument::getDocumentId)
                .toList();

        return repository.findAllById(docIds);
    }
}
