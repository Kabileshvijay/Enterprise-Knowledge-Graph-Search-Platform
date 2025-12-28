package com.enterprise.knowledge.service;

import com.enterprise.knowledge.dto.DocumentRequest;
import com.enterprise.knowledge.entity.Document;
import com.enterprise.knowledge.entity.Employee;
import com.enterprise.knowledge.entity.SavedDocument;
import com.enterprise.knowledge.repository.DocumentRepository;
import com.enterprise.knowledge.repository.EmployeeRepository;
import com.enterprise.knowledge.repository.SavedDocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository repository;
    private final SavedDocumentRepository savedRepo;
    private final EmployeeRepository employeeRepository;

    public DocumentService(
            DocumentRepository repository,
            SavedDocumentRepository savedRepo,
            EmployeeRepository employeeRepository,
    ) {
        this.repository = repository;
        this.savedRepo = savedRepo;
        this.employeeRepository = employeeRepository;
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

    /* ================= SEARCH DOCUMENTS ================= */

    public List<Document> searchDocuments(String keyword) {
        return repository.findByTitleContainingIgnoreCase(keyword);
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
