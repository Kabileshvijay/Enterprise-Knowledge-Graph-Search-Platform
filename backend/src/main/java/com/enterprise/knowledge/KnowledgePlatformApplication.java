package com.enterprise.knowledge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class KnowledgePlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(KnowledgePlatformApplication.class, args);
	}
}
