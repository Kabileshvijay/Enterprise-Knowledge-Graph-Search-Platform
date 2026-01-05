package com.enterprise.knowledge.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class AISummaryService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public AISummaryService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public String summarize(String content) {

        if (content == null || content.isBlank()) {
            return "No content to summarize.";
        }

        // Optional: limit content to avoid large payloads
        if (content.length() > 4000) {
            content = content.substring(0, 4000);
        }

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of(
                                                "text",
                                                "Summarize the following content clearly and concisely:\n\n" + content
                                        )
                                }
                        )
                }
        );

        try {
            Map<?, ?> response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/models/gemini-2.5-flash:generateContent")
                            .queryParam("key", apiKey)
                            .build()
                    )
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("candidates")) {
                var candidates = (Iterable<?>) response.get("candidates");
                var first = candidates.iterator().next();
                if (first instanceof Map<?, ?> map) {
                    var contentMap = (Map<?, ?>) map.get("content");
                    var parts = (Iterable<?>) contentMap.get("parts");
                    var part = parts.iterator().next();
                    if (part instanceof Map<?, ?> partMap) {
                        return partMap.get("text").toString();
                    }
                }
            }

            return "Unable to generate summary.";

        } catch (Exception e) {
            e.printStackTrace();
            return "AI service temporarily unavailable.";
        }
    }
}
