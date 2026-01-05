package com.enterprise.knowledge.dto;

import com.enterprise.knowledge.entity.Document;
import java.util.List;

public class DocumentSearchResponse {

    private List<Document> content;
    private int totalPages;
    private long totalElements;

    public DocumentSearchResponse(
            List<Document> content,
            int totalPages,
            long totalElements
    ) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }

    public List<Document> getContent() {
        return content;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }
}
