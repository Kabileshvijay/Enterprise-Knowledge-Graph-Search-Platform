package com.enterprise.knowledge.dto;

import com.enterprise.knowledge.entity.Employee;

public class LoginSuccessResponse {

    private String name;
    private String email;
    private String role;

    public LoginSuccessResponse(String name, String email, String role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public LoginSuccessResponse(String token, Employee employee) {
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
