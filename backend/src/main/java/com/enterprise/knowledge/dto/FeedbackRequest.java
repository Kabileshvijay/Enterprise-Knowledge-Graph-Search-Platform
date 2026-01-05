package com.enterprise.knowledge.dto;

public class FeedbackRequest {

    private String type;
    private String message;

    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
