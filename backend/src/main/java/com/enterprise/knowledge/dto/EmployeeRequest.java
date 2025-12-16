package com.enterprise.knowledge.dto;

import java.util.List;

public class EmployeeRequest {

    private String name;
    private String email;
    private String team;
    private String password;
    private List<String> skills;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTeam() { return team; }
    public void setTeam(String team) { this.team = team; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
}

