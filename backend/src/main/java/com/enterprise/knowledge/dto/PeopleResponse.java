package com.enterprise.knowledge.dto;

import java.util.List;

public class PeopleResponse {

    private Long id;
    private String name;
    private String email;
    private String team;
    private List<String> skills;
    private long documentCount;
    private long totalLikes;

    public PeopleResponse(
            Long id,
            String name,
            String email,
            String team, List<String> skills,
            long documentCount,
            long totalLikes
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.team = this.team;
        this.skills = skills;
        this.documentCount = documentCount;
        this.totalLikes = totalLikes;
    }

    // getters
    public Long getId() { return id; }

    public String getName() { return name; }

    public String getEmail() { return email; }

    public String getTeam() { return team; }

    public List<String> getSkills() { return skills; }

    public long getDocumentCount() { return documentCount; }

    public long getTotalLikes() { return totalLikes; }
}
