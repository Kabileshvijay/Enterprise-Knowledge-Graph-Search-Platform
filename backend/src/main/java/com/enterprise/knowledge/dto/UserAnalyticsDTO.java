package com.enterprise.knowledge.dto;

import java.util.List;

public class UserAnalyticsDTO {

    public int totalTime;
    public int documentsOpened;
    public String mostViewedDoc;
    public int avgTimePerDoc;

    public List<DocumentAnalyticsDTO> documents;
}
